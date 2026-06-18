"use client";

import { useRef, useEffect } from "react";

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
// TEMPORARY PLACEHOLDER — replace with final Shikho bird illustration before launch.
// Brand colors (pink #FF6B9D, yellow #FFD166, teal #06D6A0) are approximate.

function BirdSVG() {
  return (
    <svg width="80" height="52" viewBox="0 0 80 52" fill="none" aria-hidden="true">
      <path d="M40 28 C28 15 12 18 0 11 C14 15 26 22 40 28Z" fill="#FF6B9D" />
      <path d="M40 28 C52 15 68 18 80 11 C66 15 54 22 40 28Z" fill="#FFD166" />
      <ellipse cx="40" cy="30" rx="8" ry="5" fill="#06D6A0" />
      <circle cx="50" cy="25" r="5" fill="#06D6A0" />
      <circle cx="52" cy="24" r="1.5" fill="white" />
      <circle cx="52.5" cy="24" r="0.8" fill="#111" />
      <path d="M55 23.5 L63 23 L55 26.5Z" fill="#FFD166" />
      <path d="M32 33 L22 44 L30 37 L27 46 L34 39 L38 34Z" fill="#FF6B9D" opacity="0.85" />
    </svg>
  );
}

// ─── Status bar icons ─────────────────────────────────────────────────────────

function StatusBarIcons() {
  return (
    <div className="flex items-center gap-[5px]">
      {/* Signal bars */}
      <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
        <rect x="0"  y="8" width="3" height="4" rx="0.5" opacity="1"/>
        <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" opacity="1"/>
        <rect x="9"  y="3" width="3" height="9" rx="0.5" opacity="1"/>
        <rect x="13.5" y="0" width="3" height="12" rx="0.5" opacity="0.35"/>
      </svg>
      {/* WiFi */}
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M1 3.8C3.6 1.4 12.4 1.4 15 3.8" opacity="0.35"/>
        <path d="M3.2 6.2C5 4.6 11 4.6 12.8 6.2"/>
        <path d="M5.6 8.6C6.5 7.8 9.5 7.8 10.4 8.6"/>
        <circle cx="8" cy="11" r="1" fill="currentColor" stroke="none"/>
      </svg>
      {/* Battery */}
      <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
        <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" strokeOpacity="0.35"/>
        <rect x="22.5" y="3.5" width="2" height="5" rx="1" fill="currentColor" fillOpacity="0.4"/>
        <rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor"/>
      </svg>
    </div>
  );
}

// ─── Phone mockup ─────────────────────────────────────────────────────────────
// Frame style adapted from Legend.xyz: near-black inset frame, highly rounded,
// warm off-white screen background, white rounded cards.
//
// TEMPORARY PLACEHOLDER — screen content is a structural scaffold.
// Replace each section marked below with the real Shikho Home screen design.

function PhoneMockup() {
  return (
    <div
      className="relative w-[260px] h-[520px] rounded-[44px] overflow-hidden bg-[#f2f2ef]"
      style={{
        boxShadow: "inset 0 0 0 7px #1c1c1e, 0 50px 100px rgba(0,0,0,0.38), 0 20px 40px rgba(0,0,0,0.22)",
      }}
      aria-label="Shikho app — phone mockup"
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-[18px] pt-[14px] pb-[6px] text-[#1c1c1e]">
        <span className="text-[12px] font-semibold tracking-tight">9:41</span>
        <StatusBarIcons />
      </div>

      {/* Screen content */}
      <div className="flex flex-col gap-2.5 px-3.5 pb-4 h-full overflow-hidden">

        {/* App header — TEMPORARY PLACEHOLDER: replace with Shikho wordmark */}
        <div className="flex items-center justify-between pt-0.5">
          <div>
            <span className="text-[13px] font-bold text-emerald-600 tracking-tight leading-none">shikho</span>
            <p className="text-[10px] text-[#8e8e93] mt-0.5">স্বাগতম 👋</p>
          </div>
          {/* TEMPORARY PLACEHOLDER — user avatar */}
          <div className="w-[28px] h-[28px] rounded-full bg-emerald-200" />
        </div>

        {/* Priority subject cards — TEMPORARY PLACEHOLDER */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8e8e93]">
            আজকের বিষয়
          </p>
          {[
            { label: "পদার্থ", pct: 68, accent: "#3b82f6" },
            { label: "রসায়ন",  pct: 45, accent: "#a855f7" },
            { label: "গণিত",   pct: 82, accent: "#ef4444" },
          ].map(({ label, pct, accent }) => (
            <div key={label} className="bg-white rounded-[14px] px-3 py-2" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-semibold text-[#1c1c1e]">{label}</span>
                <span className="text-[10px]" style={{ color: accent }}>{pct}%</span>
              </div>
              <div className="w-full h-[3px] rounded-full bg-[#f2f2f2]">
                <div className="h-[3px] rounded-full" style={{ width: `${pct}%`, backgroundColor: accent, opacity: 0.7 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick-access row — TEMPORARY PLACEHOLDER: replace with real icons */}
        <div className="grid grid-cols-4 gap-1.5 mt-0.5">
          {["ক্লাস", "AI", "কুইজ", "র‍্যাংক"].map((label) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-[14px] bg-white" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }} />
              <span className="text-[8.5px] text-[#8e8e93]">{label}</span>
            </div>
          ))}
        </div>

        {/* Course progress stepper — TEMPORARY PLACEHOLDER */}
        <div className="bg-white rounded-[14px] px-3 py-2.5 mt-auto" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8e8e93] mb-2">
            কোর্স প্রগ্রেস
          </p>
          {[
            { label: "Q1 — সম্পন্ন",  dot: "#34c759" },
            { label: "Q2 — চলমান",    dot: "#007aff" },
            { label: "Q3 — লক 🔒",    dot: "#d1d1d6" },
          ].map(({ label, dot }) => (
            <div key={label} className="flex items-center gap-2 py-[3px]">
              <div className="w-[7px] h-[7px] rounded-full shrink-0" style={{ backgroundColor: dot }} />
              <span className="text-[9.5px] text-[#3c3c43]">{label}</span>
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

    const APPROACH_END = 0.55;
    const PERCH_END    = 0.80;
    const BIRD_W = 80, BIRD_H = 52;
    const PHONE_H = 520;

    let rafId: number;

    const frame = (now: number) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const rect       = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - vh;
      const progress   = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;

      // Bezier control points
      const perchX = vw / 2 - BIRD_W / 2;
      const perchY = vh / 2 - PHONE_H / 2 - BIRD_H - 10;

      const P0: Point = { x: -BIRD_W - 20,  y: vh * 0.78 };
      const P1: Point = { x: vw * 0.04,      y: vh * 0.04 };
      const P2: Point = { x: vw * 0.32,      y: vh * 0.18 };
      const P3: Point = { x: perchX,          y: perchY    };
      const depart:   Point = { x: vw * 1.15, y: -BIRD_H * 2 };

      let bx = P0.x, by = P0.y, bs = 1.1, bo = 1, br = 0, go = 0;

      if (progress <= APPROACH_END) {
        const t   = easeInOut(clamp(progress / APPROACH_END, 0, 1));
        const pos = cubicBezier(t, P0, P1, P2, P3);
        const tan = bezierTangent(t, P0, P1, P2, P3);
        bx = pos.x; by = pos.y;
        bs = lerp(1.1, 0.78, t);
        bo = 1;
        br = Math.atan2(tan.y, tan.x) * (180 / Math.PI);
        go = 0;

      } else if (progress <= PERCH_END) {
        const phaseT = (progress - APPROACH_END) / (PERCH_END - APPROACH_END);
        bx = perchX;
        by = perchY + Math.sin(now * 0.003) * 6;
        bs = 0.78; bo = 1; br = -5;
        go = Math.sin(phaseT * Math.PI) * 0.7;

      } else {
        const t = easeInOut(clamp((progress - PERCH_END) / (1 - PERCH_END), 0, 1));
        bx = lerp(perchX, depart.x, t);
        by = lerp(perchY, depart.y, t);
        bs = lerp(0.78, 0.25, t);
        bo = clamp(1 - t * 1.5, 0, 1);
        br = lerp(-5, -50, t);
        go = 0;
      }

      bird.style.transform = `translate(${bx}px,${by}px) scale(${bs}) rotate(${br}deg)`;
      bird.style.opacity   = String(bo);
      glow.style.opacity   = String(go);

      // Clouds + fog: fade, rise, scale on scroll
      const co = clamp(1 - progress * 1.5, 0, 1);
      const ct = `translateY(${progress * -80}px) scale(${1 + progress * 0.10})`;

      cloudBack.style.opacity    = String(co);
      cloudBack.style.transform  = ct;
      cloudFront.style.opacity   = String(co);
      cloudFront.style.transform = ct;
      if (fog) {
        fog.style.opacity   = String(co);
        fog.style.transform = `translateY(${progress * -60}px)`;
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      <style>{`
        @keyframes drift-back  { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes drift-front { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .cloud-back-drift  { animation: drift-back  90s linear infinite; }
        .cloud-front-drift { animation: drift-front 60s linear infinite; }
      `}</style>

      <section ref={sectionRef} className="relative min-h-[200vh]">
        <div
          className="sticky top-0 h-screen overflow-hidden"
          style={{ background: "linear-gradient(180deg, #D4E3EC 0%, #EDE7DC 100%)" }}
        >

          {/* ── Back cloud layer ──────────────────────────────────────────
              Asset: /hero/clouds/back-1.webp (legend_hero_earn_background.webp)
              Misty trees & rocks floating in white mist — distant atmosphere.
              Positioned at bottom 10% of the viewport, drifts slowly (90s). ── */}
          <div
            ref={cloudBackRef}
            className="absolute left-0 right-0 bottom-[8%] pointer-events-none will-change-transform overflow-hidden"
            style={{ height: "42vh", transformOrigin: "center bottom" }}
          >
            <div className="cloud-back-drift flex w-[200%] h-full">
              {[0, 1].map((i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src="/hero/clouds/back-1.webp"
                  alt=""
                  className="w-1/2 h-full object-cover object-top"
                  style={{ opacity: 0.65 }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

          {/* ── Front cloud layer ─────────────────────────────────────────
              Asset: /hero/clouds/front-1.webp (legend_hero_borrow_background.webp)
              Denser grass & rocks — closer horizon, faster drift (60s).
              Positioned at the very bottom, partially covered by fog strip. ── */}
          <div
            ref={cloudFrontRef}
            className="absolute left-0 right-0 bottom-0 pointer-events-none will-change-transform overflow-hidden"
            style={{ height: "34vh", transformOrigin: "center bottom" }}
          >
            <div className="cloud-front-drift flex w-[200%] h-full">
              {[0, 1].map((i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src="/hero/clouds/front-1.webp"
                  alt=""
                  className="w-1/2 h-full object-cover object-top"
                  style={{ opacity: 0.75 }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

          {/* ── Fog strip ────────────────────────────────────────────────
              Asset: /hero/fog-static.webp (1440×521px)
              Soft white misty edge sits over the cloud layers, creating the
              "ascending through mist" feel as clouds fade on scroll.
              min-w-[1440px] preserves detail at narrower viewports. ────── */}
          <div
            ref={fogRef}
            className="absolute bottom-0 left-0 right-0 pointer-events-none z-10 overflow-hidden will-change-transform"
            style={{ height: "220px" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/fog-static.webp"
              alt=""
              className="absolute bottom-0 left-1/2 -translate-x-1/2 max-w-none"
              style={{ width: "100%", minWidth: "1440px", height: "auto" }}
              aria-hidden="true"
            />
          </div>

          {/* ── Headline + subhead ────────────────────────────────────────── */}
          <div className="absolute top-[10%] left-0 right-0 flex flex-col items-center gap-2 z-20 text-center px-6 pointer-events-none">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
              শেখাটা এখন আরও স্মার্ট।
            </h1>
            <p className="text-lg md:text-xl text-slate-500 mt-1">
              SSC ও HSC প্রস্তুতির সবচেয়ে স্মার্ট সঙ্গী।
            </p>
          </div>

          {/* ── Warm glow behind phone (pulses when bird perches) ─────────── */}
          <div
            ref={glowRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none z-10"
            style={{
              opacity: 0,
              willChange: "opacity",
              background: "radial-gradient(circle, rgba(255,200,80,0.55) 0%, rgba(255,160,40,0.2) 50%, transparent 72%)",
            }}
          />

          {/* ── Phone mockup ──────────────────────────────────────────────── */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <PhoneMockup />
          </div>

          {/* ── Bird ──────────────────────────────────────────────────────────
              TEMPORARY PLACEHOLDER — replace BirdSVG with the final Shikho
              bird illustration asset before launch. ──────────────────────── */}
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
