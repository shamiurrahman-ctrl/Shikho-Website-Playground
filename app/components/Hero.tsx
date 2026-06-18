"use client";

import { useRef, useEffect, useState } from "react";

// ─── Math helpers ─────────────────────────────────────────────────────────────

interface Point { x: number; y: number }

function cubicBezier(t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point {
  const m = 1 - t;
  return {
    x: m*m*m*p0.x + 3*m*m*t*p1.x + 3*m*t*t*p2.x + t*t*t*p3.x,
    y: m*m*m*p0.y + 3*m*m*t*p1.y + 3*m*t*t*p2.y + t*t*t*p3.y,
  };
}

function bezierTangent(t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point {
  const m = 1 - t;
  return {
    x: 3*m*m*(p1.x-p0.x) + 6*m*t*(p2.x-p1.x) + 3*t*t*(p3.x-p2.x),
    y: 3*m*m*(p1.y-p0.y) + 6*m*t*(p2.y-p1.y) + 3*t*t*(p3.y-p2.y),
  };
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function easeInOut(t: number) { return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t; }

// ─── Bird SVG ─────────────────────────────────────────────────────────────────
// TEMPORARY PLACEHOLDER — replace with final Shikho bird illustration SVG before launch.
// Brand colors used here (pink #FF6B9D, yellow #FFD166, teal #06D6A0) are approximate;
// confirm against final brand spec.

function BirdSVG() {
  return (
    <svg width="80" height="52" viewBox="0 0 80 52" fill="none" aria-hidden="true">
      {/* Left wing */}
      <path d="M40 28 C28 15 12 18 0 11 C14 15 26 22 40 28Z" fill="#FF6B9D" />
      {/* Right wing */}
      <path d="M40 28 C52 15 68 18 80 11 C66 15 54 22 40 28Z" fill="#FFD166" />
      {/* Body */}
      <ellipse cx="40" cy="30" rx="8" ry="5" fill="#06D6A0" />
      {/* Head */}
      <circle cx="50" cy="25" r="5" fill="#06D6A0" />
      {/* Eye */}
      <circle cx="52" cy="24" r="1.5" fill="white" />
      <circle cx="52.5" cy="24" r="0.8" fill="#111" />
      {/* Beak */}
      <path d="M55 23.5 L63 23 L55 26.5Z" fill="#FFD166" />
      {/* Tail */}
      <path d="M32 33 L22 44 L30 37 L27 46 L34 39 L38 34Z" fill="#FF6B9D" opacity="0.85" />
    </svg>
  );
}

// ─── Cloud blob ───────────────────────────────────────────────────────────────
// TEMPORARY PLACEHOLDER — CSS rounded blob standing in for real photographic cloud PNGs.
// See ImgWithFallback usage below for the full swap path.

function CloudBlob({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`${className} bg-white/50 rounded-[60%_40%_55%_50%/55%_65%_40%_50%]`}
    />
  );
}

// Image with a CSS fallback shown when the asset file is missing
function ImgWithFallback({
  src, alt, imgClass = "", fallback,
}: {
  src: string; alt: string; imgClass?: string; fallback: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return <img src={src} alt={alt} className={imgClass} onError={() => setFailed(true)} />;
}

// ─── Fog strip ────────────────────────────────────────────────────────────────
// TEMPORARY PLACEHOLDER ASSET: /hero/fog-strip.png does not exist yet.
// Replace ImgWithFallback fallback with the real asset when available.

function FogStrip() {
  return (
    <ImgWithFallback
      src="/hero/fog-strip.png"
      alt=""
      imgClass="w-full object-cover"
      fallback={
        /* TEMPORARY PLACEHOLDER — swap for real /hero/fog-strip.png before launch */
        <div className="w-full h-36 bg-gradient-to-t from-white/55 to-transparent" />
      }
    />
  );
}

// ─── Phone mockup ─────────────────────────────────────────────────────────────
// TEMPORARY PLACEHOLDER — screen content is a structural scaffold matching the
// Home screen layout from CLAUDE.md Section 4 (greeting, priority subjects, quick
// access, course progress). Replace every section marked below with the real
// Shikho Home screen design before launch.

function PhoneMockup() {
  return (
    <div
      className="relative w-[260px] h-[520px] rounded-[2.5rem] border-4 border-slate-800 bg-white shadow-2xl overflow-hidden"
      aria-label="Shikho app — placeholder phone mockup"
    >
      {/* Status bar — static/minimal per CLAUDE.md spec (no battery animation) */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1 bg-white text-slate-700">
        <span className="text-[9px] font-semibold">9:41</span>
        <div className="flex items-center gap-0.5">
          <div className="w-8 h-2.5 rounded border border-current flex items-center px-0.5">
            <div className="h-1.5 w-5 rounded-sm bg-current" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4 bg-slate-50 h-full overflow-hidden">
        {/* App header */}
        <div className="flex items-center justify-between pt-1">
          <div>
            {/* TEMPORARY PLACEHOLDER — replace with actual Shikho wordmark/logo */}
            <span className="text-sm font-bold text-emerald-600 tracking-tight">shikho</span>
            <p className="text-[10px] text-slate-400">স্বাগতম 👋</p>
          </div>
          {/* TEMPORARY PLACEHOLDER — user avatar circle */}
          <div className="w-7 h-7 rounded-full bg-emerald-200" />
        </div>

        {/* Priority subject cards — TEMPORARY PLACEHOLDER */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">
            আজকের বিষয়
          </p>
          {[
            { label: "পদার্থ", pct: 68, bg: "bg-blue-50 border-blue-200"   },
            { label: "রসায়ন",  pct: 45, bg: "bg-purple-50 border-purple-200" },
            { label: "গণিত",   pct: 82, bg: "bg-rose-50 border-rose-200"   },
          ].map(({ label, pct, bg }) => (
            <div key={label} className={`rounded-xl px-3 py-2 border ${bg}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-semibold text-slate-700">{label}</span>
                <span className="text-[9px] text-slate-400">{pct}%</span>
              </div>
              <div className="w-full h-1 rounded-full bg-white/80">
                <div
                  className="h-1 rounded-full bg-slate-400/60"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quick-access row — TEMPORARY PLACEHOLDER — replace icons with real assets */}
        <div className="grid grid-cols-4 gap-1.5">
          {["ক্লাস", "AI", "কুইজ", "র‍্যাংক"].map((label) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-xl bg-white shadow-sm border border-slate-100" />
              <span className="text-[8px] text-slate-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Course progress stepper — TEMPORARY PLACEHOLDER */}
        <div className="rounded-xl bg-white border border-slate-100 px-3 py-2 mt-auto">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
            কোর্স প্রগ্রেস
          </p>
          {[
            { label: "Q1 — সম্পন্ন ✓", dot: "bg-emerald-400" },
            { label: "Q2 — চলমান",     dot: "bg-blue-400"    },
            { label: "Q3 — লক 🔒",     dot: "bg-slate-200"   },
          ].map(({ label, dot }) => (
            <div key={label} className="flex items-center gap-2 py-0.5">
              <div className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
              <span className="text-[9px] text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  const sectionRef    = useRef<HTMLElement>(null);
  const birdRef       = useRef<HTMLDivElement>(null);
  const glowRef       = useRef<HTMLDivElement>(null);
  const cloudBackRef  = useRef<HTMLDivElement>(null);
  const cloudFrontRef = useRef<HTMLDivElement>(null);
  const fogRef        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section    = sectionRef.current;
    const bird       = birdRef.current;
    const glow       = glowRef.current;
    const cloudBack  = cloudBackRef.current;
    const cloudFront = cloudFrontRef.current;
    const fog        = fogRef.current;
    if (!section || !bird || !glow || !cloudBack || !cloudFront) return;

    // Phase thresholds (scroll progress 0..1)
    const APPROACH_END = 0.55; // bird arrives above phone
    const PERCH_END    = 0.80; // bird departs

    // Phone + bird dimensions (must match PhoneMockup and BirdSVG sizes above)
    const BIRD_W = 80, BIRD_H = 52;
    const PHONE_H = 520;

    let rafId: number;

    const frame = (now: number) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Scroll progress: 0 when section top hits viewport top,
      // 1 when section bottom reaches viewport bottom.
      // Using getBoundingClientRect() is safe here — it's called inside RAF,
      // not synchronously inside the render cycle, so no layout thrash.
      const rect       = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - vh;
      const progress   = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;

      // ── Bezier path ─────────────────────────────────────────────────────
      // Perch point: centered on phone, just above its top edge
      const perchX = vw / 2 - BIRD_W / 2;
      const perchY = vh / 2 - PHONE_H / 2 - BIRD_H - 10;

      // Control points chosen so the bird arcs up sharply first (gains altitude),
      // then sweeps down toward the phone top — matching the spec's bezier description.
      const P0: Point = { x: -BIRD_W - 20,  y: vh * 0.78 }; // off-screen lower-left
      const P1: Point = { x: vw * 0.04,      y: vh * 0.04 }; // high arc up-left
      const P2: Point = { x: vw * 0.32,      y: vh * 0.18 }; // sweeps toward center
      const P3: Point = { x: perchX,          y: perchY    }; // above phone

      const depart: Point = { x: vw * 1.15, y: -BIRD_H * 2 }; // off-screen upper-right

      // Output values (set per phase below)
      let bx = P0.x, by = P0.y, bs = 1.1, bo = 1, br = 0, go = 0;

      if (progress <= APPROACH_END) {
        // ── Phase 1: Approach — bird flies along bezier toward phone ─────
        const t   = easeInOut(clamp(progress / APPROACH_END, 0, 1));
        const pos = cubicBezier(t, P0, P1, P2, P3);
        const tan = bezierTangent(t, P0, P1, P2, P3);
        bx = pos.x;
        by = pos.y;
        bs = lerp(1.1, 0.78, t);                              // perspective shrink
        bo = 1;
        br = Math.atan2(tan.y, tan.x) * (180 / Math.PI);     // face direction of travel
        go = 0;

      } else if (progress <= PERCH_END) {
        // ── Phase 2: Perch — bird bobs above phone, glow pulses ──────────
        const phaseT = (progress - APPROACH_END) / (PERCH_END - APPROACH_END);
        bx = perchX;
        by = perchY + Math.sin(now * 0.003) * 6;             // ±6px bob, ~2s period
        bs = 0.78;
        bo = 1;
        br = -5;                                              // slight resting tilt
        go = Math.sin(phaseT * Math.PI) * 0.7;               // glow rises then falls

      } else {
        // ── Phase 3: Depart — bird lifts off upper-right, shrinks, fades ─
        const t = easeInOut(clamp((progress - PERCH_END) / (1 - PERCH_END), 0, 1));
        bx = lerp(perchX,  depart.x, t);
        by = lerp(perchY,  depart.y, t);
        bs = lerp(0.78, 0.25, t);
        bo = clamp(1 - t * 1.5, 0, 1);                       // fades out before fully off-screen
        br = lerp(-5, -50, t);                                // banks upward on lift-off
        go = 0;
      }

      // Apply transform + opacity only (no layout-triggering properties)
      bird.style.transform = `translate(${bx}px,${by}px) scale(${bs}) rotate(${br}deg)`;
      bird.style.opacity   = String(bo);
      glow.style.opacity   = String(go);

      // ── Cloud scroll effect: fade + rise + scale (all transform + opacity) ──
      // Clouds are fully gone at ~67% progress (1 / 1.5), well before hero ends.
      const co = clamp(1 - progress * 1.5, 0, 1);
      const ct = `translateY(${progress * -90}px) scale(${1 + progress * 0.12})`;

      cloudBack.style.opacity   = String(co);
      cloudBack.style.transform = ct;
      cloudFront.style.opacity  = String(co * 0.9);
      cloudFront.style.transform = ct;
      if (fog) {
        fog.style.opacity   = String(co);
        fog.style.transform = ct;
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      {/*
        Keyframes injected inline to keep this component self-contained.
        The CSS animation drives horizontal cloud drift independently of scroll;
        the scroll-driven vertical effect is applied via JS refs above.
      */}
      <style>{`
        @keyframes drift-back  { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes drift-front { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .cloud-back-drift  { animation: drift-back  90s linear infinite; }
        .cloud-front-drift { animation: drift-front 60s linear infinite; }
      `}</style>

      {/*
        Outer scroll container.
        min-h-[200vh] = 1 viewport of scroll travel (200vh - 100vh viewport = 100vh scrollable).
        The bird journey maps across 100% of that travel.
      */}
      <section ref={sectionRef} className="relative min-h-[200vh]">

        {/* Sticky viewport — everything inside here stays pinned */}
        <div
          className="sticky top-0 h-screen overflow-hidden"
          style={{ background: "linear-gradient(180deg, #CAD4D8 0%, #E1DDD0 100%)" }}
        >

          {/* ── Back cloud layer ─────────────────────────────────────────
              Slow drift (90s), large/faint — distant cirrus feel.
              PLACEHOLDER ASSET: /hero/clouds/back-1.png does not exist yet.
              Duplicate the inner div for a seamless 200%-wide loop. ────── */}
          <div
            ref={cloudBackRef}
            className="absolute inset-0 pointer-events-none will-change-transform"
            style={{ transformOrigin: "center bottom" }}
          >
            <div className="cloud-back-drift flex w-[200%] h-full">
              {[0, 1].map((i) => (
                <div key={i} className="relative w-1/2 h-full">
                  <ImgWithFallback
                    src="/hero/clouds/back-1.png"
                    alt=""
                    imgClass="absolute inset-0 w-full h-full object-cover opacity-35"
                    fallback={
                      /* TEMPORARY PLACEHOLDER — swap for /hero/clouds/back-1.png before launch */
                      <div className="absolute inset-0 flex items-center gap-10 px-8 opacity-25">
                        <CloudBlob className="w-96 h-40" />
                        <CloudBlob className="w-64 h-28" />
                        <CloudBlob className="w-80 h-36" />
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Front cloud layer ─────────────────────────────────────────
              Faster drift (60s), lower + denser — closer cumulus feel.
              PLACEHOLDER ASSETS: /hero/clouds/front-1.png and front-2.png
              do not exist yet. ────────────────────────────────────────── */}
          <div
            ref={cloudFrontRef}
            className="absolute inset-0 pointer-events-none will-change-transform"
            style={{ transformOrigin: "center bottom" }}
          >
            <div className="cloud-front-drift flex w-[200%] h-full items-end pb-[18%]">
              {[0, 1].map((i) => (
                <div key={i} className="relative w-1/2 h-full">
                  <ImgWithFallback
                    src="/hero/clouds/front-1.png"
                    alt=""
                    imgClass="absolute bottom-0 left-0 w-full h-auto opacity-55"
                    fallback={
                      /* TEMPORARY PLACEHOLDER — swap for /hero/clouds/front-1.png + front-2.png before launch */
                      <div className="absolute bottom-0 left-0 right-0 flex items-end gap-6 px-6 pb-0 opacity-45">
                        <CloudBlob className="w-72 h-32" />
                        <CloudBlob className="w-48 h-24" />
                        <CloudBlob className="w-64 h-28" />
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Static fog strip (misty horizon near bottom of hero) ──────
              PLACEHOLDER ASSET: /hero/fog-strip.png does not exist yet. ── */}
          <div
            ref={fogRef}
            className="absolute bottom-0 left-0 right-0 pointer-events-none z-10 will-change-transform"
            style={{ transformOrigin: "center bottom" }}
          >
            <FogStrip />
          </div>

          {/* ── Headline + subhead ────────────────────────────────────────
              Positioned in upper portion so the bird arc can pass through
              this area on its way to the phone, drawing attention to text. */}
          <div className="absolute top-[10%] left-0 right-0 flex flex-col items-center gap-2 z-20 text-center px-6 pointer-events-none">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
              শেখাটা এখন আরও স্মার্ট।
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mt-1">
              SSC ও HSC প্রস্তুতির সবচেয়ে স্মার্ট সঙ্গী।
            </p>
          </div>

          {/* ── Warm glow (appears when bird perches, driven by RAF loop) ─ */}
          <div
            ref={glowRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none z-10"
            style={{
              opacity: 0,
              willChange: "opacity",
              background: "radial-gradient(circle, rgba(255,200,80,0.5) 0%, rgba(255,160,40,0.18) 50%, transparent 72%)",
            }}
          />

          {/* ── Phone mockup (pinned at viewport center) ──────────────── */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <PhoneMockup />
          </div>

          {/* ── Bird (all motion via RAF loop above) ──────────────────────
              TEMPORARY PLACEHOLDER: BirdSVG is a geometric stand-in.
              Replace with final Shikho bird illustration SVG before launch. */}
          <div
            ref={birdRef}
            className="absolute top-0 left-0 pointer-events-none z-30 will-change-transform"
            style={{ opacity: 0 }}
            aria-hidden="true"
          >
            <BirdSVG />
          </div>

        </div>
      </section>
    </>
  );
}
