# Shikho Homepage Redesign — Project Brief

## Tech stack

- **Framework:** Next.js (App Router) + React + TypeScript
- **Styling:** Tailwind CSS
- **Scaffold:** Fresh — no existing conventions yet
- **Components:** Build all sections as components under `app/components/`

---

## 1. Project summary

Redesign the Shikho.com homepage (Bangladeshi SSC/HSC edtech platform) to:
- Showcase shipped and in-development app features through an immersive, scroll-driven narrative
- Use a pinned phone mockup that morphs through features as the user scrolls (Legend.xyz-style scrollytelling, but starting in the hero itself rather than after a separate manifesto section)
- Introduce the Shikho bird logo as an animated mascot, woven into the hero and into scroll mechanics
- Keep the website's own visual design system independent from the app's — the app UI is reference for **content and feature logic only**, not visual style to copy directly

**Current live site for reference:** https://shikho.com/

---

## 2. Brand mascot — the Shikho bird

The Shikho logo is a stylized, multi-colored bird in flight (geometric wings, gradient brand colors — pinks/yellows/teals depending on context). Decision: use this bird as a recurring, interactive mascot across the site, not just a static logo mark.

**Primary uses (locked):**
1. **Hero sky scene** — the bird flies in, arcs toward, and lands/perches on the phone mockup as the user scrolls (see Section 4)
2. **Scroll-progress indicator** — for the 6-feature scrollytelling sequence, the bird (or a marker styled after it) hops along a progress path as the user scrolls through each feature beat, instead of generic dots/numbers

**Secondary uses (not yet built, worth considering later):** loading/AI-thinking states, empty states (search/notifications/404), subtle cursor-follow on desktop, animated favicon.

---

## 3. Page skeleton (top to bottom)

1. **Hero + Scrollytelling** (combined into one continuous pinned section — see Sections 4 & 5)
2. **Trust/stats bar** — animated count-up, triggered on scroll into view
3. **Secondary feature grid** — 4 features (Search+Explore, E-Book, Archive Course Access, FutureBook)
4. **Mentors** — dedicated trust-building section with instructor photos/credentials (not yet detailed — treat as open)
5. **Testimonials / media coverage / investors-partners / footer** — current site already has versions of these; decision on whether to restyle-only or rework was deferred. Default to carrying forward current content structure, restyled to match new design, unless directed otherwise during build.

---

## 4. Hero section

**Headline (locked):** শেখাটা এখন আরও স্মার্ট। *(Learning, now smarter.)*
**Subhead (draft, refine during build):** SSC ও HSC প্রস্তুতির সবচেয়ে স্মার্ট সঙ্গী।

**Background concept:** Sky with drifting, dissipating clouds (inspired by Legend.xyz's misty landscape hero, reinterpreted as open sky — more aspirational/optimistic tone fitting an edtech brand vs. Legend's moody fintech tone).

**Bird + cloud mechanic:**
- Two cloud layers (back: slow drift, large, soft/faint; front: faster drift, crisper) animate continuously via independent drift loop, regardless of scroll
- On scroll, in three phases tied to scroll progress of the hero:
  1. **Approach (0–55% of hero scroll):** bird starts off-screen lower-left, arcs upward first (gains altitude), then curves down via bezier path toward the phone mockup's top edge — banks slightly, shrinks a little (perspective)
  2. **Perch/hover (55–80%):** bird settles just above the phone, gentle bob animation; a soft warm glow pulses in behind the phone at the same time (arrival/energizing moment)
  3. **Departs (80–100%):** bird lifts off again, flies up/right, shrinks away; glow fades; clouds are now fully dissipated, clearing the way for the next section
- Clouds fade out + rise + scale up slightly across the same overall scroll progress (feels like ascending through them), fully cleared by the time the user reaches the first feature beat

**Phone mockup:** Pinned/sticky, centered, showing the live Shikho Home screen from frame one — this same mockup continues into the scrollytelling sequence below (hero and scrollytelling are one continuous block, not two separate sections).

**A working interactive HTML demo of this hero mechanic was built during planning** (sky gradient, drifting clouds, bird bezier-path flight to phone, landing glow) — use as a starting reference for behavior/timing, not final visual polish (colors, cloud style, bird illustration, and phone UI in that demo are all placeholder).

**Open decisions for this section:**
- Final cloud illustration style (the demo uses flat CSS blob shapes — real version likely wants softer, painterly illustrated clouds)
- Whether the bird lands and stays visible as a perched icon during the feature scroll sequence, or fully exits before features begin
- Mobile behavior for the whole hero+scroll mechanic (deferred — decide after seeing desktop version)

---

## 5. Scrollytelling feature sequence

Six features, each gets a full-viewport "beat" with text content beside the pinned phone mockup, while the mockup's on-screen content morphs to match. Order is **not yet finalized** — listed here in a working sequence; feel free to test alternate orderings during build.

**Motion philosophy (applies to all 6):**
- Each loop: 5–6.5 seconds, designed to loop seamlessly
- Easing: standard ease-in-out for most motion; reserve spring/bounce only for genuine delight moments (e.g. a lock unlocking, leaderboard rank arriving) — keep the overall feel calm/premium, not cartoonish
- Status bar in the phone mockup stays static/minimal throughout — no battery/time animation, avoids distracting micro-motion
- Loop resets via quick fade (~200ms), never a hard cut
- Content for each loop should be **custom-designed/animated from the Figma flows referenced below** — not pre-existing footage; treat as a from-scratch motion design task

### Feature 1 — Smart Class AI
**Headline:** ভিডিও দেখো, AI দিয়ে বুঝে নাও।
**Sub:** প্রতিটা সেগমেন্টের জন্য আলাদা ব্যাখ্যা, প্র্যাকটিস, আর গাইডেন্স।

**What it is:** Lecture videos are segmented by concept (timestamped: ভূমিকা → মূল বিষয় → উদাহরণ etc.). At any point, students open a context-aware AI panel scoped to exactly the current segment, with three modes:
- **বুঝিয়ে দাও (Explain):** structured breakdown — main concept, how it works, worked example, common mistakes
- **অনুশীলন (Practice):** segment-specific MCQs, instant right/wrong feedback, per-option error reasoning, adjustable difficulty (easier/harder/similar)
- **নির্দেশনা (Guide):** step-by-step procedural walkthrough with watch-outs and verification steps

An expandable segment strip (thumbnail + timestamp + label) lets students jump to any concept; the AI panel refreshes to match. Works in both stacked-mobile and full-screen side-drawer layouts.

**Loop sequence:** video plays → tap segment-strip chevron → strip expands revealing thumbnails → tap a segment → video jumps, AI panel slides up → tab cycles Explain (text fades in) → Practice (tap option, red/green flash) → Guide (step list fades in) → reset.

**Reference:** Figma "Smart Class (R)" file — sections "Smart Class - AI" (node 284:4537) and "Smart Class - Full Screen UI - side drawer" (node 298:4271).

### Feature 2 — Shikho AI
**Headline:** যেকোনো প্রশ্ন, তাৎক্ষণিক উত্তর।
**Sub:** টাইপ করো বা ছবি তুলো — Shikho AI বুঝে নেবে, উত্তর দেবে সাথে সাথেই।

**What it is:** Open-ended AI doubt-solver, distinct from Smart Class's segment-scoped AI. Student types or photographs any question within their enrolled subjects; gets a structured, instant answer. Has a daily usage tracker and example-prompt suggestions. Tightly integrated with Search — any search query can be forwarded into Shikho AI with subject auto-detected.

**Loop sequence:** empty chat state with placeholder → question types in character-by-character → send tap → brief thinking pulse → structured answer streams in line-by-line (staggered fade-up) → hold → reset.

**Reference:** Seen embedded within the Home flow (Figma "Homepage Redesign 2026" file, node 1:15015) and within Universal Search (Figma "Universal Search (DH)" file, node 92:16283).

### Feature 3 — Priority Subjects + Report Card
**Headline:** কী পড়তে হবে, রিপোর্ট কার্ডই বলে দেবে।
**Sub:** তোমার পারফরম্যান্স অনুযায়ী সাজানো প্রায়োরিটি, প্রতিদিনের জন্য।

**What it is:** One connected system, not two features. Report Card is the analytics engine (overall score with week-over-week delta, dual progress rings for chapter-exam-score and class-completion, color-coded subject performance table, learning-activity stats, trend line graphs, leaderboard with podium + ranked list + subject-specific filter, confetti/celebration at 80%+ chapter scores, shareable result cards). Priority Subjects is its actionable surface: from the Report Card's subject table (or from Home), students select which subjects to track and drag-rank them by need — Home then surfaces prioritized subject cards with live progress, reflecting that order.

**Loop sequence:** Report Card view (score ৯০%, color-tagged subject table) → tap "সাজাও" → subject checklist (boxes tick on in sequence) → auto-advance to drag-rank screen (weak subject animates to top) → cut/slide to Home — priority cards now reflect new order, progress bars fill in → hold → reset.

**Reference:** Figma "Report Card Revamp (DH)" file — "Final UI V2 (Phase 1)" page (node 361:305, esp. "Without Model Test" node 2118:40226) and "⚡️ New changes" page (node 4182:20765, esp. "Priority Set (From Report Card)" node 4566:14355). Also Figma "Homepage Redesign 2026" file, node 1272:76389 for the subject-priority flow as it appears from Home.

### Feature 4 — Course Progress
**Headline:** ধাপে ধাপে এগিয়ে যাও, পরিকল্পনামাফিক।
**Sub:** প্রতিটা কোয়ার্টার শেষ করো, নতুনটা আনলক হবে নিজে থেকেই।

**What it is:** A vertical stepper showing quarters/terms with status: completed (green check), active/in-progress (blue), locked (gray, padlock) — with unlock CTAs for upcoming quarters.

**Loop sequence:** stepper at rest (quarter 1 done, quarter 2 active, quarter 3 locked) → quarter 2's progress bar fills 80%→100% → checkmark pop, connecting line draws down → quarter 3's lock morphs into unlocked/active state with a brief glow pulse (the one place in this whole sequence that can use a slight bounce/spring — "unlocking" benefits from a moment of delight) → hold → reset.

**Reference:** Figma "Homepage Redesign 2026" file, node 2942:72909 ("Course Progress" section).

### Feature 5 — Practice MCQ
**Headline:** নিজেকে যাচাই করো, যেকোনো সময়।
**Sub:** নিজের মতো কুইজ বানাও, সাথে সাথে ফলাফল আর ব্যাখ্যা পাও।

**What it is:** A custom quiz builder — students self-select subject(s) → chapter(s)/topic(s) → question count (10/20/30/40, auto-timed at ~1min/question) → review summary → start. Quiz-taking has a countdown timer, question-pill navigator, full grid overview (answered/unanswered/current status), graceful exit-intent and lost-connection handling. Post-quiz feedback breaks down correct/wrong/unanswered, filterable by result type, with bookmarkable questions and rich step-by-step explanations (diagrams where useful). Bookmarked questions form a personal "Saved Quiz" revision bank. Results are shareable as gamified, branded score-tier cards (e.g. "ঘুমন্ত প্রতিভা" / "Sleeping Genius") with per-subject strength tags, shareable to social platforms.

**Loop sequence:** MCQ question with 4 options, timer ticking → tap an option → wrong flashes red, correct highlights green (quick, 150–200ms) → slides to feedback view, "কেন ভুল" explanation expands → cut to results summary, correct/wrong/unanswered counts count up (fast ease-out) → hold → reset.

**Reference:** Figma "Practice MCQ (DH)" file — "Create Quiz" (node 155:17446), "Quiz Flow" (node 155:22012), "MCQ Solutions" (node 155:22530), "Report Card" — chapter-level (node 243:25814), "Share Quiz Result" (node 3731:24516).

### Feature 6 — Leaderboard
**Headline:** নিজের জায়গা জানো, এগিয়ে যাওয়ার অনুপ্রেরণা পাও।
**Sub:** সারাদেশের শিক্ষার্থীদের মাঝে তোমার র‍্যাংক, সাবজেক্ট অনুযায়ী।

**What it is:** Top-3 podium (avatar, medal, score, school name) plus ranked list (4th–10th+), student's own row highlighted, sticky "your rank" bar with share action. Filterable by subject (with graceful empty state pre-results). Rank shown against real scale (e.g. "rank 5696 of X") for credibility.

**Loop sequence:** podium view → reveal ranked list below, own row highlighted → sticky bottom bar slides up, rank number counts up/settles (odometer-style digit roll) → subject filter dropdown taps open briefly, list re-sorts → hold → reset. Light confetti burst on first load only (not every loop cycle, to avoid visual noise on repeat).

**Reference:** Figma "Report Card Revamp (DH)" file — "Leaderboard" frame within "Without Model Test" (node 2118:40554) and "Leaderboard filter" section on the "⚡️ New changes" page (node 4182:21384).

---

## 6. Trust / stats bar

**Numbers (pulled directly from current live site, kept as-is):**
- ৩০ লক্ষ+ শিক্ষার্থী (30 lakh+ students)
- ২০ জন+ অভিজ্ঞ মেন্টর (20+ experienced mentors)
- ৪৫ লক্ষ+ অ্যাপ ডাউনলোড (45 lakh+ app downloads)
- ৫ লক্ষ+ লার্নিং ম্যাটেরিয়াল (5 lakh+ learning materials)

**Behavior:** animated count-up from 0 to final value, triggered once via scroll-into-view (IntersectionObserver or equivalent), directly after the hero+scrollytelling block.

---

## 7. Secondary feature grid

Four curated tiles (narrowed down from 7 candidates — Mentors was pulled out into its own dedicated section instead of being a grid tile; Guideline Videos folded conceptually into E-Book):

1. **Search + Explore (merged into one tile)** — "find anything instantly — by typing, voice, or browsing every subject." Covers: unified search across chapters/classes/mentors/e-books/features, voice search with live transcription, smart/trending suggestions, direct AI escalation from a search query, plus the Explore hub's subject→chapter→content-type navigation.
   - *Reference:* Figma "Explore Page (DH)" file (node 1:2) and "Universal Search (DH)" file (node 1:861).
2. **E-Book** — digital textbooks, flashcards, MCQ question banks, organized story-based/summary-based.
   - *Reference:* Figma "Explore Page (DH)" file, node 2086:34317.
3. **Archive Course Access** — purchased courses remain permanently accessible even after the course period ends ("own it forever" trust angle).
   - *Reference:* Figma "Explore Page (DH)" file, node 2086:36004 (not deep-dived in detail; confirmed via description from product context).
4. **FutureBook** — QR-linked tool tracking video-viewing/tuition progress via a physical/digital "FutureLink" bridge. Least self-evident feature in the set — give this tile slightly more explanatory copy than the others.
   - *Reference:* seen embedded in Home flow, Figma "Homepage Redesign 2026" file (appears between Course Progress and Features grid in node 1:15015 screenshot).

---

## 8. Mentors section (open — not yet detailed)

Decision made: Mentors Profile gets pulled out of the feature grid into its **own dedicated trust-building section**, similar in spirit to the current site's testimonials section — instructor photos, credentials, subject specialties. Layout, content depth, and exact placement relative to testimonials still need to be defined during build.

*Reference:* Figma "Explore Page (DH)" file, node 2086:34842 ("Mentors Profile" section, not yet deep-dived).

---

## 9. Sections carried forward (pending review)

The following sections exist on the current live site and were not redesigned during planning — default to keeping their content structure and restyling to match the new design system, unless revisited:
- Testimonials carousel (video + quote cards from real students/parents)
- "কেন Shikho-তে আস্থা রাখবে" (why trust Shikho) — 4-point trust grid (সেরা কন্টেন্ট, সহজ স্টাডি ম্যাটেরিয়াল, স্বল্প খরচে অনেক কিছু, সাবলীল উপস্থাপনা)
- Call-now banner (16780 helpline)
- Free video library / Facebook group promo
- Media coverage (press logos/links)
- Investors / partners logos
- Footer (app download CTA, social links, company info, legal links)

---

## 10. Visual design system — explicitly NOT inherited from the app

Important constraint carried through all of planning: **the website should NOT copy the app's visual language** (its dark navy/blue gradients, card styles, gamification colors). The app Figma flows referenced throughout this brief are for **content and feature-logic reference only**. The website needs its own, independently designed visual system — colors, typography, card styles, spacing — to be defined during the build process. The hero's sky/cloud/bird concept (Section 4) is the first piece of that independent visual identity.

---

## 11. Source references index

All features above were sourced from these Figma files (ask the person sharing this brief for fresh links if access is needed):
- **Homepage Redesign 2026 (DH)** — multi-state homepage flows (Paid User, Free User, Trial Expired, etc.)
- **Smart Class (R)** — segmented video + AI explain/practice/guide flows
- **Explore Page (DH)** — subject/chapter navigation, E-Book, Report Card (V1), Mentors, Archive Course, Guideline Videos, Model Test
- **Universal Search (DH)** — text search, voice search, AI handoff
- **Report Card Revamp (DH)** — Report Card V2/V3, Leaderboard, Priority Set integration ("Final UI V2 (Phase 1)" and "⚡️ New changes" pages specifically)
- **Practice MCQ (DH)** — quiz builder, quiz-taking flow, solutions/feedback, saved quizzes, chapter report card, share result

Also referenced: legend.xyz (scrollytelling mechanic + hero atmosphere inspiration), current live site shikho.com (existing stats, trust sections, testimonials).
