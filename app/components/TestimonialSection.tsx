'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
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

/* ---------------- background player ---------------- */

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
  'enablejsapi=1', // lets us hard-disable the captions module below
].join('&');

function BackgroundVideo({
  story,
  active,
  paused,
  eager,
}: {
  story: Story;
  active: boolean;
  paused: boolean;
  eager: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active && !paused) void v.play().catch(() => {});
    else v.pause();
  }, [active, paused]);

  /**
   * cc_load_policy alone only stops captions being *forced* on — a viewer whose
   * YouTube account defaults to captions would still get them burned over the
   * background. Unloading the captions module via the embed's postMessage API is
   * the only way to guarantee they never appear. Retried because the module can
   * finish loading slightly after the iframe fires onLoad.
   */
  const disableCaptions = useCallback(() => {
    const w = frameRef.current?.contentWindow;
    if (!w) return;
    const send = (func: string, args: unknown[]) => {
      try {
        w.postMessage(JSON.stringify({ event: 'command', func, args }), 'https://www.youtube.com');
      } catch {
        /* cross-origin hiccup — the retries below cover it */
      }
    };
    // module name differs across player versions; both are harmless no-ops
    send('unloadModule', ['captions']);
    send('unloadModule', ['cc']);
  }, []);

  useEffect(() => {
    if (story.videoSrc || !active || paused) return;
    const timers = [300, 1200, 2500].map((d) => window.setTimeout(disableCaptions, d));
    return () => timers.forEach(clearTimeout);
  }, [story.videoSrc, active, paused, disableCaptions]);

  return (
    <div className="tst-bg-layer" data-active={active ? '1' : undefined}>
      {/* poster sits under the player so switching never flashes black */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="tst-bg-poster" src={posterFor(story)} alt="" loading={eager ? 'eager' : 'lazy'} />

      {story.videoSrc ? (
        <video
          ref={videoRef}
          className="tst-bg-media"
          src={story.videoSrc}
          poster={posterFor(story)}
          muted
          loop
          playsInline
          preload={eager ? 'metadata' : 'none'}
        />
      ) : (
        /* no local mp4 yet — a chrome-less muted YouTube embed stands in. Only the
           active, unpaused story mounts an iframe, so nothing loads in the background. */
        active &&
        !paused && (
          <iframe
            ref={frameRef}
            className="tst-bg-media"
            src={
              `https://www.youtube.com/embed/${story.youtubeId}` +
              `?playlist=${story.youtubeId}&${BG_PARAMS}`
            }
            title=""
            aria-hidden
            tabIndex={-1}
            allow="autoplay; encrypted-media"
            onLoad={disableCaptions}
          />
        )
      )}
    </div>
  );
}

/* ---------------- left overlay: title + play CTA ---------------- */

function StoryOverlay({ story, onPlay }: { story: Story; onPlay: () => void }) {
  return (
    <div className="tst-overlay-content">
      <h3 className="tst-story-title" key={story.id}>
        {story.title}
      </h3>
      <div className="tst-play-row">
        <button className="tst-play" type="button" onClick={onPlay} aria-label={`${story.title} — ভিডিয়ো দেখো`}>
          <Image src="/assets/testimonials/play-button.svg" alt="" width={64} height={64} />
        </button>
        <button className="tst-play-label" type="button" onClick={onPlay} tabIndex={-1}>
          ভিডিয়ো দেখো
        </button>
      </div>
    </div>
  );
}

/* ---------------- glass quote card ---------------- */

function QuoteCard({ story }: { story: Story }) {
  return (
    <figure className="tst-quote" key={story.id}>
      <Image className="tst-quote-icon" src="/assets/testimonials/quote-icon.svg" alt="" width={66} height={66} />
      <blockquote className="tst-quote-text">{story.quote}</blockquote>
      <figcaption className="tst-quote-info">
        <span className="tst-quote-author">{story.author}</span>
        <span className="tst-quote-detail">{story.detail}</span>
      </figcaption>
    </figure>
  );
}

/* ---------------- thumbnail navigation ---------------- */

function ThumbnailList({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (i: number) => void;
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
          onClick={() => onSelect(i)}
        >
          <Image src={s.thumbnail} alt="" width={171} height={96} />
          {i === activeIndex && (
            <span className="tst-thumb-ring" aria-hidden>
              <svg viewBox="0 0 38 38" focusable="false">
                <circle className="tst-ring-track" cx="19" cy="19" r="14" />
                <circle className="tst-ring-fill" cx="19" cy="19" r="14" />
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
  const active = STORIES[activeIndex];

  const select = useCallback(
    (i: number) => {
      if (i === activeIndex) return;
      // brief dip on the overlay/card so the swap reads as a cinematic cut
      setSwitching(true);
      setActiveIndex(i);
      window.setTimeout(() => setSwitching(false), CROSSFADE_MS);
    },
    [activeIndex],
  );

  useEffect(() => () => setSwitching(false), []);

  return (
    <section className="tst" data-dark="0">
      <header className="tst-head">
        <h2 className="tst-title">Shikho-র সাথে বদলে যাওয়া গল্পগুলো</h2>
        <p className="tst-sub">
          দেশের বিভিন্ন প্রান্তের শিক্ষার্থীরা কীভাবে Shikho-র সাথে নিজেদের লক্ষ্য অর্জন করেছে, শুনে নাও তাদের মুখেই।
        </p>
      </header>

      {/* the card lives outside .tst-stage so it can overlap the video on desktop
          and simply flow beneath it once the layout stacks */}
      <div className="tst-frame" data-switching={switching ? '1' : undefined}>
        <div className="tst-stage">
          {STORIES.map((s, i) => (
            <BackgroundVideo
              key={s.id}
              story={s}
              active={i === activeIndex}
              paused={!!modalStory}
              eager={i === 0}
            />
          ))}

          {/* progressive blur + gradient, purely for legibility */}
          <div className="tst-scrim" aria-hidden>
            <span className="tst-blur tst-blur-1" />
            <span className="tst-blur tst-blur-2" />
            <span className="tst-blur tst-blur-3" />
            <span className="tst-grad" />
          </div>

          <StoryOverlay story={active} onPlay={() => setModalStory(active)} />
          <ThumbnailList activeIndex={activeIndex} onSelect={select} />
        </div>

        <QuoteCard story={active} />
      </div>

      <VideoModal story={modalStory} onClose={() => setModalStory(null)} />
    </section>
  );
}
