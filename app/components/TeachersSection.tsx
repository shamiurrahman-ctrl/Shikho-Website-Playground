'use client';

import Image from 'next/image';
import { Fragment, useEffect, useRef, useState } from 'react';
import MentorDrawer from './MentorDrawer';
import { TEACHERS, type Teacher } from './teachers';

/**
 * "Shikho-এর শিক্ষকমণ্ডলী" — teacher roster (Figma 117:21308).
 *
 * Each teacher is a fixed-height row. Hovering one row runs a single coordinated
 * transition: the row crossfades to a dark navy gradient, the square portrait
 * swaps for the taller cut-out (which breaks out above the row), the subject book
 * slides in from the right, text colours warm to white, the arrow fills blue, and
 * every other row is de-emphasised. Only transform/opacity/colour animate — the
 * row box itself never changes size, so nothing reflows.
 *
 * Clicking a row opens <MentorDrawer/>.
 */

const TITLE = 'দেশের সেরা শিক্ষকদের সঙ্গে শেখো আত্মবিশ্বাসের সাথে।';

function TeacherRow({
  teacher,
  index,
  active,
  onEnter,
  onLeave,
  onOpen,
}: {
  teacher: Teacher;
  index: number;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onOpen: () => void;
}) {
  return (
    <li
      className="tch-row"
      data-on={active ? '1' : undefined}
      style={{ ['--accent' as string]: teacher.accent, ['--i' as string]: index }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <span className="tch-row-dark" aria-hidden />

      {/* cloud sits above the row background but behind the portrait */}
      <span className="tch-cloud" aria-hidden>
        <Image src="/assets/teachers/cloud.png" alt="" width={327} height={168} />
      </span>

      <span className="tch-portrait">
        <span className="tch-portrait-clip">
          <Image
            className="tch-portrait-def"
            src={teacher.portrait}
            alt={teacher.name}
            width={153}
            height={153}
          />
        </span>
        {/* taller cut-out — breaks out above the row on hover */}
        <Image
          className="tch-portrait-hov"
          src={teacher.portraitHover}
          alt=""
          aria-hidden
          width={200}
          height={200}
        />
      </span>

      <span className="tch-book" aria-hidden>
        <Image src={teacher.book} alt="" width={188} height={188} />
      </span>

      <span className="tch-body">
        <span className="tch-main">
          <span className="tch-idblock">
            <span className="tch-name">{teacher.name}</span>
            <span className="tch-academic">{teacher.academic}</span>
          </span>
          <span className="tch-meta">
            <span className="tch-subject">{teacher.subject}</span>
            <i className="tch-div" aria-hidden />
            <span>{teacher.experience}</span>
            <i className="tch-div" aria-hidden />
            <span>{teacher.students}</span>
          </span>
        </span>

        <span className="tch-cta" aria-hidden>
          <Image className="tch-cta-def" src="/assets/teachers/arrow-circle.svg" alt="" width={48} height={48} />
          <Image className="tch-cta-hov" src="/assets/teachers/arrow-circle-hover.svg" alt="" width={48} height={48} />
        </span>
      </span>

      {/* full-row hit target — keeps the row's absolute layout untouched while
          giving the interaction real button semantics and keyboard support */}
      <button
        className="tch-hit"
        type="button"
        onClick={onOpen}
        onFocus={onEnter}
        onBlur={onLeave}
        aria-label={`${teacher.name} — মেন্টরের বিস্তারিত`}
      />
    </li>
  );
}

export default function TeachersSection() {
  const [active, setActive] = useState<string | null>(null);
  const [openMentor, setOpenMentor] = useState<Teacher | null>(null);
  /** '' → hidden, '1' → playing the staggered reveal, 'done' → settled */
  const [reveal, setReveal] = useState<'' | '1' | 'done'>('');
  const sectionRef = useRef<HTMLElement>(null);

  // one-shot reveal when the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setReveal('1');
        io.disconnect();
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // once the stagger has played out, drop the reveal delays so hover stays instant
  useEffect(() => {
    if (reveal !== '1') return;
    const t = setTimeout(() => setReveal('done'), 1200);
    return () => clearTimeout(t);
  }, [reveal]);

  return (
    <section
      className="tch"
      ref={sectionRef}
      data-dark="0"
      data-revealed={reveal || undefined}
      data-hovering={active ? '1' : undefined}
    >
      <div className="tch-wrap">
        {/* split per word so the title can blur-reveal in sequence, matching the
            hero and core-features headings */}
        <h2 className="tch-title">
          {TITLE.split(' ').map((w, i) => (
            // real space text nodes between the spans keep normal line-breaking
            <Fragment key={`${w}-${i}`}>
              {i > 0 && ' '}
              <span className="tch-w" style={{ ['--i' as string]: i }}>
                {w}
              </span>
            </Fragment>
          ))}
        </h2>

        <ul className="tch-list" onMouseLeave={() => setActive(null)}>
          {TEACHERS.map((t, i) => (
            <TeacherRow
              key={t.id}
              teacher={t}
              index={i}
              active={active === t.id}
              onEnter={() => setActive(t.id)}
              onLeave={() => setActive(null)}
              onOpen={() => setOpenMentor(t)}
            />
          ))}
        </ul>

        {/* "see more" bar from the Figma — awaiting a destination for the roster page */}
        <div className="tch-more">
          <span>আরো দেখো</span>
          <Image src="/assets/teachers/cta-arrow.svg" alt="" width={30} height={15} />
        </div>
      </div>

      <MentorDrawer teacher={openMentor} onClose={() => setOpenMentor(null)} />
    </section>
  );
}
