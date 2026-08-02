'use client';

import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MEDIA, type MediaItem } from './media';

/**
 * "গণমাধ্যমে Shikho" — press coverage (Figma 150:18738).
 *
 * Layout, type and colour are the frame's: 320x412 cards at 24px radius, a
 * 224px logo panel over a white scrim, headline and date always visible. Only
 * the motion departs from it — the brief calls for 9.5deg rather than the
 * frame's 15, on a 180/20/0.8 spring, plus a +/-2deg cursor tilt.
 *
 * Hovering pauses the marquee via `animation-play-state` (never by clearing the
 * transform, which would restart it) and runs one choreographed sequence: the
 * face darkens, the scrim and logo drop away, the screenshot springs up out of
 * the card, then headline, date and the arrow button follow in order.
 *
 * The screenshot is a sibling above the card face rather than a child of any
 * clipped box, so "floating outside the card" needs no overflow tricks.
 */

const TITLE = 'গণমাধ্যমে Shikho';
const SUB =
  'দৈনিক সংবাদপত্র, টেলিভিশন চ্যানেলসহ বিভিন্ন গণমাধ্যমে Shikho সম্পর্কে প্রকাশিত বিভিন্ন সংবাদ ও প্রতিবেদনসমূহ';

/** the list is rendered twice so translating the track -50% loops seamlessly */
const LOOP = [...MEDIA, ...MEDIA];

const SPRING = { type: 'spring' as const, stiffness: 180, damping: 20, mass: 0.8 };

/* Choreography — background, then screenshot, then the text in order. */
const faceV: Variants = {
  off: { backgroundColor: '#FFFFFF' },
  on: { backgroundColor: '#414651' },
};
const fadeOutV: Variants = {
  off: { opacity: 1 },
  on: { opacity: 0 },
};
/* the screenshot's blurred echo settling down into the card behind it */
const blurV: Variants = {
  off: { opacity: 0, y: -8, scale: 1.04 },
  on: { opacity: 1, y: 0, scale: 1 },
};
const shotV: Variants = {
  off: { opacity: 0, x: 0, y: 0, scale: 1, rotate: 0 },
  on: { opacity: 1, x: 8, y: -55, scale: 1.05, rotate: -9.5 },
};
const headV: Variants = {
  off: { color: '#0A0C11', y: 0 },
  on: { color: '#FFFFFF', y: -2 },
};
const dateV: Variants = {
  off: { color: '#5B616D', y: 0 },
  on: { color: '#C3C6CC', y: -2 },
};
/* rotate cancels the -9.5deg on .mdc-shot so the button reads upright */
const arrowV: Variants = {
  off: { opacity: 0, scale: 0.72, rotate: 9.5 },
  on: { opacity: 1, scale: 1, rotate: 9.5 },
};

function MediaCard({
  item,
  active,
  reduced,
  onEnter,
  onLeave,
  onActivate,
}: {
  item: MediaItem;
  active: boolean;
  reduced: boolean;
  onEnter: () => void;
  onLeave: () => void;
  /** true when a tap only revealed the card and must not follow the link */
  onActivate: () => boolean;
}) {
  // cursor-driven tilt: -0.5..0.5 across the card maps to +/-2deg, sprung so it
  // trails the pointer instead of tracking it rigidly
  const px = useMotionValue(0);
  const tilt = useSpring(useTransform(px, [-0.5, 0.5], [2, -2]), SPRING);

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduced || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
  };

  const state = active ? 'on' : 'off';
  const t = reduced ? { duration: 0 } : SPRING;

  return (
    <motion.a
      className="mdc-card"
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={false}
      animate={state}
      /* pointer, not mouse, events: a tap also emits a synthetic mouseenter
         *before* click, which would mark the card active and let the first
         tap through to the article */
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') onEnter();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'mouse') return;
        px.set(0);
        onLeave();
      }}
      onPointerMove={onMove}
      onFocus={onEnter}
      onBlur={onLeave}
      onClick={(e) => {
        if (onActivate()) e.preventDefault();
      }}
      aria-label={`${item.outlet}: ${item.headline} (${item.date})`}
    >
      <motion.span className="mdc-face" variants={faceV} transition={{ duration: reduced ? 0 : 0.35 }} />

      {/* the whole panel fades, tint included — the frame's dark card carries no
          grey mask background, only the flat fill */}
      <motion.span
        className="mdc-panel"
        variants={fadeOutV}
        transition={{ duration: reduced ? 0 : 0.2 }}
      >
        <span className="mdc-logo">
          {/* CSS owns the box (object-fit: contain); tell next/image so it
              doesn't warn about a one-sided override */}
          <Image
            src={item.logo}
            alt=""
            width={320}
            height={224}
            sizes="320px"
            style={{ width: '100%', height: '100%' }}
          />
        </span>
      </motion.span>

      <motion.span
        className="mdc-scrim"
        aria-hidden
        variants={fadeOutV}
        transition={{ duration: reduced ? 0 : 0.3 }}
      />

      {/* Progressive blur: three blurred copies of the article shot, each masked
          to dissolve further down the card, so blur *strength* falls off with
          depth the way Figma's progressive layer blur does. A single
          backdrop-filter can't do this — it would frost the headline too.
          Always mounted, opacity-animated, so it never flashes on first hover. */}
      <motion.span
        className="mdc-blur"
        aria-hidden
        style={{ ['--shot' as string]: `url("${item.shot}")` }}
        variants={blurV}
        transition={{ duration: reduced ? 0 : 0.36, ease: [0.22, 0.75, 0.28, 1], delay: reduced ? 0 : 0.05 }}
      >
        <i className="mdc-blur-l1" />
        <i className="mdc-blur-l2" />
        <i className="mdc-blur-l3" />
        <i className="mdc-blur-veil" />
      </motion.span>

      <span className="mdc-info">
        <motion.span
          className="mdc-headline"
          variants={headV}
          transition={{ ...t, delay: reduced ? 0 : 0.14 }}
        >
          {item.headline}
        </motion.span>
        <motion.span
          className="mdc-date"
          variants={dateV}
          transition={{ ...t, delay: reduced ? 0 : 0.2 }}
        >
          {item.date}
        </motion.span>
      </span>

      {!reduced && (
        <motion.span
          className="mdc-shot"
          aria-hidden
          variants={shotV}
          transition={{ ...SPRING, opacity: { duration: 0.18 }, delay: 0.06 }}
        >
          {/* tilt rides on its own layer so it composes with the spring above */}
          <motion.span style={{ rotate: tilt, display: 'block' }}>
            <span className="mdc-frame">
              <span className="mdc-bar">
                <i />
                <i />
                <i />
              </span>
              <span className="mdc-shot-img">
                <Image
                  src={item.shot}
                  alt=""
                  width={666}
                  height={424}
                  sizes="333px"
                  style={{ width: '100%', height: '100%' }}
                />
              </span>
            </span>
          </motion.span>

          {/* sibling of the tilt layer, and counter-rotated, so the button stays
              upright over the canted screenshot exactly as the frame has it */}
          <motion.span
            className="mdc-arrow"
            variants={arrowV}
            transition={{ ...SPRING, delay: 0.26 }}
          >
            <Image src="/assets/media/figma/arrow-button.svg" alt="" width={74} height={74} />
          </motion.span>
        </motion.span>
      )}
    </motion.a>
  );
}

export default function MediaCoverageSection() {
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);

  // a revealed card on touch has no pointerleave to close it — a tap elsewhere does
  useEffect(() => {
    if (!active) return;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      if (!(e.target as Element | null)?.closest?.('.mdc-card')) setActive(null);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [active]);

  /** Touch has no hover, so the first tap stands in for it and swallows the click. */
  const activate = useCallback(
    (id: string) => () => {
      const coarse = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
      if (!coarse || active === id) return false;
      setActive(id);
      return true;
    },
    [active],
  );

  return (
    <section className="mdc" ref={sectionRef} data-dark="0" data-navbar-theme="light">
      <div className="mdc-head">
        <h2 className="mdc-title">{TITLE}</h2>
        <p className="mdc-sub">{SUB}</p>
      </div>

      {/* clip horizontally only — the screenshot has to escape upward */}
      <div className="mdc-marquee" data-paused={active ? '1' : undefined}>
        <div className="mdc-track">
          {LOOP.map((item, i) => {
            const key = `${item.id}-${i}`;
            return (
              <MediaCard
                key={key}
                item={item}
                active={active === key}
                reduced={reduced}
                onEnter={() => setActive(key)}
                onLeave={() => setActive(null)}
                onActivate={activate(key)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
