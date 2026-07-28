'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Story } from './testimonials';

/**
 * Fullscreen YouTube modal for a testimonial story.
 *
 * The background player is muted, so this is where the story is actually watched:
 * full YouTube chrome, sound on, fullscreen allowed. Mirrors <MentorDrawer/>'s
 * open/close mechanics — render-time state adjustment plus a double-rAF gate so
 * the panel paints at its "from" values and genuinely animates in.
 */

/** must stay in sync with the .tvm-* transitions in globals.css */
const CLOSE_MS = 300;

export default function VideoModal({ story, onClose }: { story: Story | null; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [shown, setShown] = useState<Story | null>(story);
  const [unmounted, setUnmounted] = useState(!story);
  const [entered, setEntered] = useState(false);

  if (story && story !== shown) setShown(story);
  if (story && unmounted) setUnmounted(false);
  if (!story && entered) setEntered(false);

  useEffect(() => {
    if (story) return;
    const t = setTimeout(() => setUnmounted(true), CLOSE_MS);
    return () => clearTimeout(t);
  }, [story]);

  useEffect(() => {
    if (!story) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [story]);

  // lock the page behind the modal without shifting it
  useEffect(() => {
    if (!story) return;
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
  }, [story]);

  // Escape to close + focus trap
  useEffect(() => {
    if (!story) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], iframe, [tabindex]:not([tabindex="-1"])',
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
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
  }, [story, onClose]);

  const onScrim = useCallback(() => onClose(), [onClose]);

  if (!shown || unmounted) return null;

  return (
    <div className="tvm" data-open={entered ? '1' : undefined}>
      <div className="tvm-scrim" aria-hidden onMouseDown={onScrim} />
      <div
        className="tvm-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={shown.title}
      >
        <button ref={closeRef} className="tvm-close" type="button" onClick={onClose} aria-label="ভিডিয়ো বন্ধ করো">
          <svg viewBox="0 0 24 24" aria-hidden focusable="false">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>
        <div className="tvm-frame">
          <iframe
            src={`https://www.youtube.com/embed/${shown.youtubeId}?autoplay=1&rel=0&playsinline=1`}
            title={shown.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
