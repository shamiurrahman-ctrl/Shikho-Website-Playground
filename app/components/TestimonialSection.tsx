'use client';

import Image from 'next/image';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LiquidGlassPlayCursor } from '@/components/ui/apple-tahoe-liquid-glass-button';
import VideoModal from './VideoModal';
import { posterFor, STORIES, type Story } from './testimonials';

/**
 * "Shikho-র সাথে বদলে যাওয়া গল্পগুলো" — testimonial carousel (Figma 132:11330).
 *
 * A muted, looping background player fills the 1328x748 stage; the left half is
 * softened by a progressive backdrop blur so the white story title stays legible.
 * Thumbnails are the only navigation (no drag, no infinite scroll) and switching
 * crossfades the background. The play CTA opens <VideoModal/> for real, audible
 * playback — the background unmounts while that's open and remounts on close.
 */

const CROSSFADE_MS = 300;
/** how long each story holds before the carousel advances itself */
const STORY_MS = 26_000;
/** circumference of the progress ring (2πr, r=14) */
const RING_CIRC = 87.9646;

/* ---------------- background player ---------------- */

/** temporary switch-diagnostics — flip to false to silence */
const DEBUG = true;
const log = (...a: unknown[]) => {
  if (DEBUG) console.log('[testimonial]', ...a);
};

/** background embed params — captions, annotations and chrome all suppressed */
const BG_PARAMS = [
  'autoplay=1',
  'mute=1',
  'loop=1',
  'controls=0',
  'modestbranding=1',
  'playsinline=1',
  'rel=0',
  'disablekb=1',
  'fs=0',
  'iv_load_policy=3', // no annotations
  'cc_load_policy=0', // don't force captions on
  'cc_lang_pref=', // and don't inherit a caption language preference
  'enablejsapi=1', // player-state events + the captions kill below
].join('&');

/** frames to settle after PLAYING before we trust the embed to be chrome-free */
const SAFETY_MS = 400;

type LayerState = 'front' | 'next' | 'leaving';

/**
 * One story's background. Rendered as an independent layer so switching is a
 * double-buffer: the incoming story mounts as `next` (opacity 0 + visibility
 * hidden, poster opaque over its iframe), reports readiness, and only then is
 * promoted to `front` and crossfaded over the outgoing `leaving` layer. A
 * newly-mounted iframe is therefore never in a visible layer at any opacity.
 */
function StoryLayer({
  story,
  state,
  paused,
  eager,
  onReady,
}: {
  story: Story;
  state: LayerState;
  paused: boolean;
  eager: boolean;
  onReady: (id: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);

  /** post a command to the embed */
  const send = useCallback((func: string, args: unknown[] = []) => {
    try {
      frameRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        'https://www.youtube.com',
      );
    } catch {
      /* cross-origin hiccup */
    }
  }, []);

  /** PLAYING -> two rendered frames -> safety delay -> declare ready */
  const settleThenReady = useCallback(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    log('player reports PLAYING', story.id);
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        window.setTimeout(() => {
          log('safety delay completed', story.id);
          setReady(true);
          onReady(story.id);
        }, SAFETY_MS),
      ),
    );
  }, [story.id, onReady]);

  /* ---- YouTube path: listen for real player state ---- */
  useEffect(() => {
    if (story.videoSrc) return;
    const onMessage = (e: MessageEvent) => {
      if (!e.origin.includes('youtube.com')) return;
      try {
        const d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (d?.info?.playerState === 1) settleThenReady();
      } catch {
        /* not a player payload */
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [story.videoSrc, settleThenReady]);

  const onFrameLoad = useCallback(() => {
    log('iframe mounted', story.id, `(state=${state})`);
    // opt into player-state events, and hard-disable captions
    try {
      frameRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening' }),
        'https://www.youtube.com',
      );
    } catch {
      /* fallback below */
    }
    send('unloadModule', ['captions']);
    send('unloadModule', ['cc']);
    // the postMessage surface is undocumented — never strand a layer unrevealed
    window.setTimeout(settleThenReady, 2600);
  }, [story.id, state, send, settleThenReady]);

  /* ---- pause/resume WITHOUT unmounting (a remount would re-expose chrome) ---- */
  useEffect(() => {
    if (story.videoSrc) {
      const v = videoRef.current;
      if (!v) return;
      if (paused) v.pause();
      else void v.play().catch(() => {});
      return;
    }
    send(paused ? 'pauseVideo' : 'playVideo');
  }, [paused, story.videoSrc, send]);

  return (
    <div className="tst-bg-layer" data-state={state}>
      {story.videoSrc ? (
        <video
          ref={videoRef}
          className="tst-bg-media"
          src={story.videoSrc}
          poster={posterFor(story)}
          autoPlay
          muted
          loop
          playsInline
          preload={eager ? 'metadata' : 'auto'}
          // no `controls` attribute at all — plus every native affordance off
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
          tabIndex={-1}
          onCanPlay={settleThenReady}
        />
      ) : (
        <iframe
          ref={frameRef}
          className="tst-bg-media"
          src={`https://www.youtube.com/embed/${story.youtubeId}?playlist=${story.youtubeId}&${BG_PARAMS}`}
          title=""
          aria-hidden
          tabIndex={-1}
          allow="autoplay; encrypted-media"
          onLoad={onFrameLoad}
        />
      )}

      {/* opaque until THIS layer is proven safe; while preparing the layer is
          hidden anyway, so the drop is never seen */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="tst-bg-poster"
        data-hide={ready ? '1' : undefined}
        src={posterFor(story)}
        alt=""
        loading={eager ? 'eager' : 'lazy'}
      />
    </div>
  );
}

/* ---------------- per-word blur reveal ---------------- */

/**
 * Splits a string into per-word spans carrying a stagger index, matching the
 * hero and teachers treatment (opacity + blur(10px) + translateY(16px)).
 * Real space text nodes sit between the spans so wrapping still works.
 * The stagger is capped so a long quote doesn't take a second to land.
 */
function blurWords(text: string, offset = 0) {
  return text.split(' ').map((w, i) => (
    <Fragment key={`${w}-${i}`}>
      {i > 0 && ' '}
      <span className="tst-w" style={{ ['--i' as string]: Math.min(i + offset, 16) }}>
        {w}
      </span>
    </Fragment>
  ));
}

/* ---------------- left overlay: title + play CTA ---------------- */

/** Static section label + divider sit above the story title and never change. */
function StoryOverlay({ story }: { story: Story }) {
  return (
    <div className="tst-overlay-content">
      <h2 className="tst-eyebrow">{blurWords('Shikho-র সাথে বদলে যাওয়া গল্পগুলো')}</h2>
      <span className="tst-divider" aria-hidden />
      {/* keyed on the story so the reveal replays on every switch */}
      <h3 className="tst-story-title" key={story.id}>
        {blurWords(story.title)}
      </h3>
    </div>
  );
}

/* ---------------- glass quote card ---------------- */

function QuoteCard({ story }: { story: Story }) {
  return (
    <figure className="tst-quote" key={story.id}>
      <Image className="tst-quote-icon" src="/assets/testimonials/quote-icon.svg" alt="" width={66} height={66} />
      <blockquote className="tst-quote-text">{blurWords(story.quote)}</blockquote>
      <figcaption className="tst-quote-info">
        <span className="tst-quote-author">{blurWords(story.author, 6)}</span>
        <span className="tst-quote-detail">{blurWords(story.detail, 9)}</span>
      </figcaption>
    </figure>
  );
}

/* ---------------- thumbnail navigation ---------------- */

function ThumbnailList({
  activeIndex,
  onSelect,
  ringRef,
}: {
  activeIndex: number;
  onSelect: (i: number) => void;
  ringRef: React.RefObject<SVGCircleElement | null>;
}) {
  return (
    <div className="tst-thumbs" role="tablist" aria-label="গল্প নির্বাচন করো">
      {STORIES.map((s, i) => (
        <button
          key={s.id}
          className="tst-thumb"
          type="button"
          role="tab"
          aria-selected={i === activeIndex}
          aria-label={s.title}
          data-active={i === activeIndex ? '1' : undefined}
          // stop the click reaching the stage, which would open the modal
          onClick={(e) => {
            e.stopPropagation();
            onSelect(i);
          }}
        >
          <Image src={s.thumbnail} alt="" width={171} height={96} />
          {/* the ring only exists on the active thumb, and remounts per story, so a
              stale timer can never keep painting onto an inactive one */}
          {i === activeIndex && (
            <span className="tst-thumb-ring" aria-hidden>
              <svg viewBox="0 0 38 38" focusable="false">
                <circle className="tst-ring-track" cx="19" cy="19" r="14" />
                <circle ref={ringRef} className="tst-ring-fill" cx="19" cy="19" r="14" />
              </svg>
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ---------------- section ---------------- */

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalStory, setModalStory] = useState<Story | null>(null);
  const [switching, setSwitching] = useState(false);
  /* double-buffer: `front` is on screen, `next` prepares invisibly, `leaving`
     lingers under the crossfade just long enough to be faded over */
  const [frontStory, setFrontStory] = useState<Story>(STORIES[0]);
  const [nextStory, setNextStory] = useState<Story | null>(null);
  const [leavingStory, setLeavingStory] = useState<Story | null>(null);
  const active = frontStory;

  const ringRef = useRef<SVGCircleElement | null>(null);
  const elapsedRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const [cursorOn, setCursorOn] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [lensSize, setLensSize] = useState(76);
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  /**
   * Selecting only *stages* a story. Thumbnails and the timer respond at once,
   * but the visible story (background + title + card) doesn't change until the
   * incoming layer reports it's fully prepared — see onLayerReady.
   */
  const goTo = useCallback(
    (i: number) => {
      setActiveIndex(i);
      const target = STORIES[i];
      if (target.id === frontStory.id) {
        setNextStory(null); // selected back onto what's already showing
        return;
      }
      // Re-selecting the story that's mid-way through fading out: it's still
      // mounted and playing, so reverse the crossfade rather than staging a
      // second copy of it (which would collide with the leaving layer).
      if (leavingStory && target.id === leavingStory.id) {
        log('reversing crossfade back to', target.id);
        setNextStory(null);
        setLeavingStory(frontStory);
        setFrontStory(target);
        return;
      }
      log('staging next story', target.id);
      setNextStory(target);
    },
    [frontStory, leavingStory],
  );

  /** the staged layer is safe to show: crossfade it over the outgoing one */
  const onLayerReady = useCallback(
    (id: string) => {
      setNextStory((pending) => {
        if (!pending || pending.id !== id) return pending;
        log('crossfade started', id);
        setSwitching(true);
        setLeavingStory(frontStory);
        setFrontStory(pending);
        window.setTimeout(() => {
          setSwitching(false);
          setLeavingStory(null);
          log('previous iframe removed', frontStory.id);
        }, CROSSFADE_MS + 250);
        return null;
      });
    },
    [frontStory],
  );

  const select = useCallback(
    (i: number) => {
      if (i === activeIndex) return;
      goTo(i);
    },
    [activeIndex, goTo],
  );

  // a new story always starts its ring from zero, however it was reached
  useEffect(() => {
    elapsedRef.current = 0;
    if (ringRef.current) ringRef.current.style.strokeDashoffset = String(RING_CIRC);
  }, [activeIndex]);

  /**
   * Story timer. Drives the ring straight through the DOM rather than React state
   * so the 26s fill doesn't cost a re-render per frame. Elapsed time lives in a ref,
   * so pausing (modal open) resumes exactly where it left off instead of restarting.
   */
  const paused = !!modalStory;
  useEffect(() => {
    if (paused) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      elapsedRef.current += now - last;
      last = now;
      const p = Math.min(elapsedRef.current / STORY_MS, 1);
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(RING_CIRC * (1 - p));
      if (p >= 1) {
        goTo((activeIndex + 1) % STORIES.length); // wraps past the last story
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, activeIndex, goTo]);

  // hold the word reveal until the scene is actually on screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setRevealed(true);
        io.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ---- floating liquid-glass play lens over the video ---- */

  /**
   * Anything that owns its own pointer behaviour keeps the normal cursor.
   * The stage itself carries role="button" for keyboard users, so it would
   * match this selector — it's excluded explicitly, or the lens would be
   * suppressed everywhere.
   */
  const INTERACTIVE = 'button, a, [role="tab"], [role="button"], input, select, textarea, .tst-quote';
  const isInteractive = useCallback((t: EventTarget | null) => {
    const hit = (t as HTMLElement | null)?.closest?.(INTERACTIVE);
    return !!hit && hit !== stageRef.current;
  }, []);

  /** over a thumbnail/link the lens hides and the OS cursor comes back */
  const [overInteractive, setOverInteractive] = useState(false);

  const onStageEnter = useCallback(
    (e: React.MouseEvent) => {
      setOverInteractive(isInteractive(e.target));
      setCursorOn(true);
    },
    [isInteractive],
  );

  const onStageMove = useCallback(
    (e: React.MouseEvent) => {
      const next = isInteractive(e.target);
      // only re-render when the answer actually flips
      setOverInteractive((prev) => (next === prev ? prev : next));
    },
    [isInteractive],
  );

  const openModal = useCallback(() => setModalStory(frontStory), [frontStory]);

  const onStageClick = useCallback(
    (e: React.MouseEvent) => {
      if (isInteractive(e.target)) return;
      openModal();
    },
    [openModal, isInteractive],
  );

  /** keyboard parity: the stage is focusable, Enter/Space opens the modal */
  const onStageKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (isInteractive(e.target)) return; // let the thumbnail handle its own key
      e.preventDefault();
      openModal();
    },
    [openModal, isInteractive],
  );

  // the modal takes over the pointer entirely, so derive rather than store
  const showCursor = cursorOn && !modalStory && !overInteractive;

  // tablet gets a slightly smaller lens (60–68px band)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const sync = () => setLensSize(mq.matches ? 64 : 76);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /**
   * One layer per story id, deduplicated. front claims its id first, so even if
   * state briefly overlaps (rapid switching) React can never receive two
   * children with the same key.
   */
  const layers = useMemo(() => {
    const seen = new Set<string>();
    const claim = (story: Story | null, state: LayerState) => {
      if (!story || seen.has(story.id)) return null;
      seen.add(story.id);
      return { story, state };
    };
    const front = claim(frontStory, 'front');
    const leaving = claim(leavingStory, 'leaving');
    const next = claim(nextStory, 'next');
    // DOM order: outgoing underneath, incoming on top
    return [leaving, front, next].filter(Boolean) as { story: Story; state: LayerState }[];
  }, [frontStory, leavingStory, nextStory]);

  return (
    <section className="tst" ref={sectionRef} data-dark="0" data-navbar-theme="dark" data-revealed={revealed ? '1' : undefined}>
      {/* the card lives outside .tst-stage so it can overlap the video on desktop
          and simply flow beneath it once the layout stacks */}
      <div className="tst-frame" data-switching={switching ? '1' : undefined}>
        <div
          className="tst-stage"
          ref={stageRef}
          role="button"
          tabIndex={0}
          aria-label="সম্পূর্ণ গল্প দেখুন"
          data-lens={showCursor ? '1' : undefined}
          onMouseEnter={onStageEnter}
          onMouseMove={onStageMove}
          onMouseLeave={() => {
            setCursorOn(false);
            setPressed(false);
          }}
          onPointerDown={(e) => !isInteractive(e.target) && setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onClick={onStageClick}
          onKeyDown={onStageKeyDown}
        >
          {layers.map((l) => (
            <StoryLayer
              key={l.story.id}
              story={l.story}
              state={l.state}
              paused={paused}
              eager
              onReady={onLayerReady}
            />
          ))}

          {/* progressive blur + gradient, purely for legibility */}
          <div className="tst-scrim" aria-hidden>
            <span className="tst-blur tst-blur-1" />
            <span className="tst-blur tst-blur-2" />
            <span className="tst-blur tst-blur-3" />
            <span className="tst-grad" />
          </div>

          <StoryOverlay story={active} />
          <ThumbnailList activeIndex={activeIndex} onSelect={select} ringRef={ringRef} />

          {/* liquid-glass play lens — lives inside the stage so its coordinates
              are container-relative, and is pointer-events:none so the stage
              underneath stays the real click target */}
          <LiquidGlassPlayCursor
            containerRef={stageRef}
            active={showCursor}
            pressed={pressed}
            size={lensSize}
            className="tst-lens"
          />
        </div>

        <QuoteCard story={active} />
      </div>

      <VideoModal story={modalStory} onClose={() => setModalStory(null)} />
    </section>
  );
}
