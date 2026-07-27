'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Teacher } from './teachers';

/**
 * Mentor detail side drawer (Figma 119:9343).
 *
 * Layout architecture: the panel is a fixed-height flex column — header, then a
 * two-column body. The body itself never scrolls; the right column is the only
 * scroll container, so the left column stays put without any scroll listeners.
 * It also carries `position: sticky` so it stays pinned if the body ever becomes
 * the scroller (which is exactly what happens once the layout stacks on tablet
 * and mobile, where sticky is switched off).
 *
 * New right-column sections (Popular Courses, Reviews, FAQ…) can be appended
 * inside `.mdr-right` with no change to the left column or the scroll wiring.
 */

/** must stay in sync with the .mdr-panel / .mdr-scrim transition in globals.css */
const CLOSE_MS = 400;

export default function MentorDrawer({
  teacher,
  onClose,
}: {
  teacher: Teacher | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);
  // `shown` lags `teacher` by one close so the panel survives its exit transition.
  // Both updates below are render-time adjustments (React re-renders immediately
  // without committing) rather than effects, which would cascade renders.
  const [shown, setShown] = useState<Teacher | null>(teacher);
  const [unmounted, setUnmounted] = useState(!teacher);

  // drives the open/close transition; starts false so the panel first paints
  // off-screen and actually has something to animate from
  const [entered, setEntered] = useState(false);

  if (teacher && teacher !== shown) {
    setShown(teacher);
    setPlaying(false);
  }
  if (teacher && unmounted) setUnmounted(false);
  if (!teacher && entered) setEntered(false);

  useEffect(() => {
    if (teacher) return;
    const t = setTimeout(() => setUnmounted(true), CLOSE_MS);
    return () => clearTimeout(t);
  }, [teacher]);

  useEffect(() => {
    if (!teacher) return;
    // double rAF: the panel must be painted at translateX(100%) before we flip
    // the flag, otherwise the browser coalesces both styles and skips the slide
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [teacher]);

  const open = !!teacher;

  // scroll-lock the page, compensating for the scrollbar so nothing shifts
  useEffect(() => {
    if (!open) return;
    const { body, documentElement: html } = document;
    const gap = window.innerWidth - html.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [open]);

  // Escape to close + a minimal focus trap inside the panel
  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], iframe, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      prevFocus?.focus?.();
    };
  }, [open, onClose]);

  // a fresh mentor always starts at the top — reset both possible scrollers,
  // since the body takes over as the scroll container once the layout stacks
  useEffect(() => {
    if (!shown) return;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [shown]);

  const onBackdrop = useCallback(() => onClose(), [onClose]);

  if (!shown || unmounted) return null;
  const t = shown;

  return (
    <div className="mdr" data-open={entered ? '1' : undefined}>
      <div className="mdr-scrim" aria-hidden onMouseDown={onBackdrop} />

      <div
        className="mdr-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${t.name} — মেন্টরের বিস্তারিত`}
      >
        <header className="mdr-head">
          <button ref={closeRef} className="mdr-close" type="button" onClick={onClose} aria-label="বন্ধ করো">
            <Image src="/assets/teachers/icon-close.svg" alt="" width={40} height={40} />
          </button>
          <span className="mdr-head-title">মেন্টরের বিস্তারিত</span>
        </header>

        <div className="mdr-body" ref={bodyRef}>
          {/* ---- left column: sticky, never scrolls on its own ---- */}
          <aside className="mdr-left">
            {/* Progressive bottom blur: three stacked copies of the same portrait.
                Each deeper layer is blurrier and its gradient mask sits lower, so
                the image goes sharp → soft → dissolved without any hard edge.
                Painted back-to-front, so the sharp copy is last. */}
            <div className="mdr-portrait">
              <Image className="mdr-p3" src={t.portraitHover} alt="" aria-hidden width={365} height={365} />
              <Image className="mdr-p2" src={t.portraitHover} alt="" aria-hidden width={365} height={365} />
              <Image className="mdr-p1" src={t.portraitHover} alt={t.name} width={365} height={365} priority />
            </div>

            <div className="mdr-idblock">
              <h2 className="mdr-name">{t.name}</h2>
              <div className="mdr-subjrow">
                <Image className="mdr-bookicon" src={t.book} alt="" width={78} height={78} />
                <div className="mdr-subjtext">
                  <span className="mdr-subject">{t.subject}</span>
                  <span className="mdr-academic">{t.academic}</span>
                </div>
              </div>
            </div>

          </aside>

          {/* ---- right column: the only scroll container ---- */}
          <div className="mdr-right" ref={scrollRef}>
            <div className="mdr-video">
              {playing && t.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${t.youtubeId}?autoplay=1&rel=0`}
                  title={`${t.name} — পরিচিতি ভিডিও`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  {t.youtubeId && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      className="mdr-video-poster"
                      src={`https://img.youtube.com/vi/${t.youtubeId}/hqdefault.jpg`}
                      alt=""
                    />
                  )}
                  <button
                    className="mdr-play"
                    type="button"
                    onClick={() => t.youtubeId && setPlaying(true)}
                    disabled={!t.youtubeId}
                    aria-label="পরিচিতি ভিডিও চালাও"
                  >
                    <Image src="/assets/teachers/icon-play.svg" alt="" width={18} height={16} />
                  </button>
                </>
              )}
            </div>

            <div className="mdr-sections">
              <div className="mdr-stats">
                <div className="mdr-stat">
                  <span className="mdr-stat-v">{t.experience}</span>
                  <span className="mdr-stat-l">অভিজ্ঞতা</span>
                </div>
                <i className="mdr-stat-div" aria-hidden />
                <div className="mdr-stat">
                  <span className="mdr-stat-v">{t.students}</span>
                  <span className="mdr-stat-l">শিক্ষার্থী পড়িয়েছেন</span>
                </div>
              </div>

              {t.achievements.length > 0 && (
                <ul className="mdr-achv">
                  {t.achievements.map((a) => (
                    <li className="mdr-achv-item" key={a}>
                      <Image src="/assets/teachers/icon-achievement.svg" alt="" width={32} height={34} />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              )}

              {t.learn.length > 0 && (
                <section className="mdr-block">
                  <h3 className="mdr-h">এই মেন্টরের সাথে যা শিখবে</h3>
                  <ul className="mdr-learn">
                    {t.learn.map((l) => (
                      <li key={l}>✓ {l}</li>
                    ))}
                  </ul>
                </section>
              )}

              {t.teachingStyle.length > 0 && (
                <section className="mdr-block">
                  <h3 className="mdr-h">পড়ানোর ধরন</h3>
                  <div className="mdr-chips">
                    {t.teachingStyle.map((s) => (
                      <span className="mdr-chip" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
