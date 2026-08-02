'use client';

import { Play } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from 'framer-motion';
import { useEffect, useId, useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';

/**
 * Apple "Tahoe" liquid-glass surface, adapted as a circular play lens that
 * floats over a video and refracts it.
 *
 * Rendering tiers, resolved once on the client:
 *
 *  1. `refract` — `backdrop-filter: url(#lens)` driving an feDisplacementMap.
 *     The displacement map is neutral grey in the middle and ramps to full
 *     R/G deviation at the rim, so the backdrop bends outward at the edge the
 *     way a convex lens does. This genuinely samples whatever is painted
 *     behind the element (including cross-origin <iframe> video), because the
 *     compositor applies it — no pixel readback, so no tainting.
 *  2. `frost` — plain `backdrop-filter: blur() saturate() brightness()`.
 *     Still samples the real backdrop, just without the edge distortion.
 *     This is the Safari/iOS path.
 *
 * There is deliberately no WebGL tier: sampling a cross-origin YouTube embed
 * into a texture is not permitted by the browser, so it could never work
 * against this backdrop and would only add a blank frame while it booted.
 * The frost tier renders on the very first paint, so the lens is never empty.
 */

export type LiquidGlassTier = 'refract' | 'frost';

/**
 * Displacement map for the lens. Mid-grey (#808080) means "no shift"; the R
 * channel drives X and the G channel drives Y. The radial mask keeps the
 * centre undistorted and lets the gradients through only near the rim.
 */
const LENS_MAP =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="e" cx="50%" cy="50%" r="50%">
          <stop offset="52%" stop-color="#000"/>
          <stop offset="100%" stop-color="#fff"/>
        </radialGradient>
        <mask id="m"><circle cx="50" cy="50" r="50" fill="url(#e)"/></mask>
        <linearGradient id="gx" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#f00"/>
        </linearGradient>
        <linearGradient id="gy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#0f0"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="#808080"/>
      <g mask="url(#m)">
        <rect width="100" height="100" fill="url(#gx)"/>
        <rect width="100" height="100" fill="url(#gy)" style="mix-blend-mode:screen"/>
      </g>
    </svg>`,
  );

/** the support probe never changes for the life of the document */
let cachedTier: LiquidGlassTier | null = null;

function clientTier(): LiquidGlassTier {
  if (cachedTier) return cachedTier;
  const supports =
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    (CSS.supports('backdrop-filter', 'url(#f)') ||
      CSS.supports('-webkit-backdrop-filter', 'url(#f)'));
  cachedTier = supports ? 'refract' : 'frost';
  return cachedTier;
}

const serverTier = (): LiquidGlassTier => 'frost';
const noSubscribe = () => () => {};

/**
 * Resolve the best available tier. SSR and hydration both see `frost`, so the
 * lens paints immediately and is never blank; the refraction upgrade lands on
 * the first client render after hydration.
 */
export function useLiquidGlassTier(): LiquidGlassTier {
  return useSyncExternalStore(noSubscribe, clientTier, serverTier);
}

/* ---------------- the glass surface ---------------- */

function GlassSurface({
  size,
  tier,
  filterId,
  blur,
  className,
}: {
  size: number;
  tier: LiquidGlassTier;
  filterId: string;
  blur: number;
  className?: string;
}) {
  // `-webkit-backdrop-filter` is a live alias of `backdrop-filter` in Chromium,
  // so emitting both would let the plain-frost value clobber the refraction.
  // Only the frost tier (Safari/iOS, which cannot parse url() here) gets the
  // prefixed property; the refract tier sets the standard property alone.
  const frost = `blur(${blur}px) saturate(180%) brightness(1.08)`;
  const refract = tier === 'refract';
  const backdrop = refract ? `${frost} url(#${filterId})` : frost;

  return (
    <div
      className={cn('relative grid place-items-center rounded-full', className)}
      style={{ width: size, height: size }}
    >
      {/* refraction + frost — samples the real video behind the element */}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          backdropFilter: backdrop,
          ...(refract ? null : { WebkitBackdropFilter: frost }),
          // a whisper of white so the lens reads on very dark frames
          background: 'rgba(255,255,255,0.12)',
        }}
      />

      {/* inner depth: bright top-left bevel, shadowed bottom-right, plus the
          soft outer shadow that lifts the lens off the video */}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: [
            'inset 0 1px 1px rgba(255,255,255,0.55)',
            'inset 0 -1px 1px rgba(255,255,255,0.18)',
            'inset 0 8px 18px rgba(255,255,255,0.10)',
            'inset 0 -10px 20px rgba(0,0,0,0.16)',
            '0 8px 26px rgba(0,0,0,0.28)',
            '0 2px 6px rgba(0,0,0,0.18)',
          ].join(','),
        }}
      />

      {/* thin luminous rim — a gradient ring masked to 1px via mask-composite,
          brightest at the top-left where the key light sits */}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          padding: 1,
          background:
            'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.28) 38%, rgba(255,255,255,0.10) 62%, rgba(255,255,255,0.65) 100%)',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          maskComposite: 'exclude',
        }}
      />

      {/* specular sheen across the upper third */}
      <span
        className="absolute inset-0 rounded-full opacity-80"
        style={{
          background:
            'radial-gradient(120% 90% at 30% 8%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.10) 34%, rgba(255,255,255,0) 58%)',
        }}
      />

      <Play
        className="relative translate-x-[6%] text-white"
        style={{
          width: size * 0.3,
          height: size * 0.3,
          filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.45))',
        }}
        fill="currentColor"
        strokeWidth={0}
        aria-hidden
      />
    </div>
  );
}

/* ---------------- the pointer-following cursor ---------------- */

export interface LiquidGlassPlayCursorProps {
  /** the element the cursor is confined to; positions are relative to its box */
  containerRef: React.RefObject<HTMLElement | null>;
  /** pointer is inside the container and the lens should be shown */
  active: boolean;
  /** pressed state, for the click-in nudge */
  pressed?: boolean;
  /** diameter in px; the tablet breakpoint shrinks this automatically */
  size?: number;
  /** frost strength in px */
  blur?: number;
  className?: string;
}

/**
 * A circular liquid-glass play lens that trails the pointer inside
 * `containerRef`. Purely decorative: it is `pointer-events: none` and
 * `aria-hidden`, so the container underneath stays the real click target.
 */
export function LiquidGlassPlayCursor({
  containerRef,
  active,
  pressed = false,
  size = 76,
  blur = 12,
  className,
}: LiquidGlassPlayCursorProps) {
  const filterId = useId().replace(/:/g, '');
  const tier = useLiquidGlassTier();
  const reduced = useReducedMotion();

  // container-relative pointer position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Reduced motion removes the lag entirely; otherwise a soft trailing spring.
  const spring = { damping: 26, stiffness: 180, mass: 0.5 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const px: MotionValue<number> = reduced ? x : sx;
  const py: MotionValue<number> = reduced ? y : sy;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const place = (e: PointerEvent, jump: boolean) => {
      const r = el.getBoundingClientRect();
      const nx = e.clientX - r.left;
      const ny = e.clientY - r.top;
      x.set(nx);
      y.set(ny);
      // seed the spring on entry so the lens fades in under the pointer
      // instead of gliding in from wherever it was last seen
      if (jump && !reduced) {
        sx.jump(nx);
        sy.jump(ny);
      }
    };

    const onEnter = (e: PointerEvent) => place(e, true);
    const onMove = (e: PointerEvent) => place(e, false);

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
    };
  }, [containerRef, x, y, sx, sy, reduced]);

  const scale = active ? (pressed ? 0.92 : 1) : 0.8;

  return (
    <>
      {tier === 'refract' && (
        <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
          <filter
            id={filterId}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
            colorInterpolationFilters="sRGB"
          >
            <feImage href={LENS_MAP} preserveAspectRatio="none" result="map" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale="46"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      )}

      <motion.div
        aria-hidden
        className={cn(
          'pointer-events-none absolute left-0 top-0 z-[5] will-change-transform',
          className,
        )}
        // centred on the pointer via negative margins — `x`/`y` are already the
        // translate channel, so a -50% translate here would fight them
        style={{ x: px, y: py, marginLeft: -size / 2, marginTop: -size / 2 }}
        initial={false}
        animate={{ opacity: active ? 1 : 0, scale: reduced ? 1 : scale }}
        transition={
          reduced
            ? { duration: 0.15, ease: 'linear' }
            : { type: 'spring', damping: 28, stiffness: 320, mass: 0.5 }
        }
      >
        <GlassSurface size={size} tier={tier} filterId={filterId} blur={blur} />
      </motion.div>
    </>
  );
}

export default LiquidGlassPlayCursor;
