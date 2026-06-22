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

**Open decisions for this section:**
- Final cloud illustration style
- Whether the bird lands and stays visible as a perched icon during the feature scroll sequence, or fully exits before features begin
- Mobile behavior for the whole hero+scroll mechanic (deferred — decide after seeing desktop version)

---

## 5. Scrollytelling feature sequence

Six features, each gets a full-viewport "beat" with text content beside the pinned phone mockup, while the mockup's on-screen content morphs to match.

### Feature 1 — Smart Class AI
**Headline:** ভিডিও দেখো, AI দিয়ে বুঝে নাও।
**Sub:** প্রতিটা সেগমেন্টের জন্য আলাদা ব্যাখ্যা, প্র্যাকটিস, আর গাইডেন্স।

### Feature 2 — Shikho AI
**Headline:** যেকোনো প্রশ্ন, তাৎক্ষণিক উত্তর।
**Sub:** টাইপ করো বা ছবি তুলো — Shikho AI বুঝে নেবে, উত্তর দেবে সাথে সাথেই।

### Feature 3 — Priority Subjects + Report Card
**Headline:** কী পড়তে হবে, রিপোর্ট কার্ডই বলে দেবে।
**Sub:** তোমার পারফরম্যান্স অনুযায়ী সাজানো প্রায়োরিটি, প্রতিদিনের জন্য।

### Feature 4 — Course Progress
**Headline:** ধাপে ধাপে এগিয়ে যাও, পরিকল্পনামাফিক।
**Sub:** প্রতিটা কোয়ার্টার শেষ করো, নতুনটা আনলক হবে নিজে থেকেই।

### Feature 5 — Practice MCQ
**Headline:** নিজেকে যাচাই করো, যেকোনো সময়।
**Sub:** নিজের মতো কুইজ বানাও, সাথে সাথে ফলাফল আর ব্যাখ্যা পাও।

### Feature 6 — Leaderboard
**Headline:** নিজের জায়গা জানো, এগিয়ে যাওয়ার অনুপ্রেরণা পাও।
**Sub:** সারাদেশের শিক্ষার্থীদের মাঝে তোমার র‍্যাংক, সাবজেক্ট অনুযায়ী।

---

## 6. Trust / stats bar

**Numbers:**
- ৩০ লক্ষ+ শিক্ষার্থী (30 lakh+ students)
- ২০ জন+ অভিজ্ঞ মেন্টর (20+ experienced mentors)
- ৪৫ লক্ষ+ অ্যাপ ডাউনলোড (45 lakh+ app downloads)
- ৫ লক্ষ+ লার্নিং ম্যাটেরিয়াল (5 lakh+ learning materials)

**Behavior:** animated count-up from 0 to final value, triggered once via scroll-into-view.

---

## 7. Secondary feature grid

Four curated tiles:
1. **Search + Explore** — unified search across chapters/classes/mentors/e-books/features
2. **E-Book** — digital textbooks, flashcards, MCQ question banks
3. **Archive Course Access** — purchased courses remain permanently accessible
4. **FutureBook** — QR-linked tool tracking video-viewing/tuition progress

---

## 8. Mentors section

Dedicated trust-building section with instructor photos, credentials, subject specialties.

---

## 9. Sections carried forward

- Testimonials carousel
- Trust grid
- Call-now banner
- Media coverage
- Partners/investors logos
- Footer

---

## 10. Visual design system — explicitly NOT inherited from the app

The website needs its own, independently designed visual system — colors, typography, card styles, spacing.

**Design reference:** See `Shikho Home.dc.html` in the repo for a complete visual reference implementation.

---

## 11. Color & Animation

- **Accent color:** Amber
- **Scroll pace:** Cinematic (slow, dramatic)
- **Language:** Bengali (all UI text and headlines)

