/**
 * Mentor roster — shared by the list section and the detail drawer.
 *
 * `achievements` / `learn` / `teachingStyle` are per-mentor editorial content.
 * Enamul's is transcribed verbatim from the Figma detail design (119:9343) and is
 * the reference for tone and length.
 *
 * PLACEHOLDER: the other four mentors' copy is written to match each one's subject
 * and background, pending real content from the team. Achievements are deliberately
 * activity/role descriptors ("শত শত লাইভ ক্লাস পরিচালনা করেছেন") rather than invented
 * titles, awards or institutional positions — these are real, named people, so
 * fabricated credentials shouldn't ship even as filler. Swap this block wholesale
 * when the real copy lands; nothing else needs to change.
 */

export type Teacher = {
  id: string;
  name: string;
  academic: string;
  subject: string;
  experience: string;
  students: string;
  /** sampled from the book cover art — drives the book's hover glow only */
  accent: string;
  portrait: string;
  portraitHover: string;
  /** subject book cover, revealed on hover */
  book: string;
  /** intro video; when set the drawer lazy-embeds it behind a poster + play button */
  youtubeId?: string;
  achievements: string[];
  learn: string[];
  teachingStyle: string[];
};

export const TEACHERS: Teacher[] = [
  {
    id: 'enamul',
    name: 'মোঃ এনামুল ইসলাম রেহান',
    academic: 'বুয়েট ’০৯, আইবিএ, ঢাবি',
    subject: 'গণিত মেন্টর',
    experience: '১৬ বছর+',
    students: '১০ লক্ষ+',
    accent: '#EB5E15',
    portrait: '/assets/teachers/enamul-default.png',
    portraitHover: '/assets/teachers/enamul-hover.png',
    book: '/assets/teachers/book-math.png',
    achievements: ['সভাপতি, বাংলাদেশ বিজ্ঞান পরিষদ', 'ফটোগ্রাফার এবং ফিল্মমেকার'],
    learn: ['কনসেপ্ট ক্লিয়ার', 'শর্টকাট টেকনিক', 'বোর্ড + ভর্তি প্রস্তুতি', 'কমন ভুলগুলো'],
    teachingStyle: [
      '🎯 ধারণা থেকে শেখান',
      '📝 নিয়মিত অনুশীলনে গুরুত্ব',
      '⚡ পরীক্ষাভিত্তিক প্রস্তুতি',
      '💬 সহজ ভাষায় ব্যাখ্যা',
    ],
  },
  {
    id: 'ruman',
    name: 'মোঃ রুমান খন্দকার',
    academic: 'রোবোটিক্স এন্ড মেকাট্রনিক্স ইঞ্জিনিয়ারিং, ঢাবি ’১৮',
    subject: 'তথ্য ও যোগাযোগ প্রযুক্তি মেন্টর',
    experience: '৬ বছর',
    students: '৫ লক্ষ+',
    accent: '#63B7A9',
    portrait: '/assets/teachers/ruman-default.png',
    portraitHover: '/assets/teachers/ruman-hover.png',
    book: '/assets/teachers/book-ict.png',
    achievements: ['আইসিটি লাইভ ক্লাস পরিচালনা করেন', 'পরীক্ষাভিত্তিক কনটেন্ট নির্মাতা'],
    learn: ['প্রোগ্রামিং লজিক', 'সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস', 'ডেটাবেজ ও নেটওয়ার্কিং', 'বোর্ডভিত্তিক প্রস্তুতি'],
    teachingStyle: [
      '💻 হাতে-কলমে কোডিং',
      '🧩 ধাপে ধাপে সমাধান',
      '🎯 ধারণা থেকে শেখান',
      '⚡ পরীক্ষাভিত্তিক প্রস্তুতি',
    ],
  },
  {
    id: 'masud',
    name: 'মাসুদ জাভেদ জিমি',
    academic: 'মেকানিক্যাল ইঞ্জিনিয়ারিং, বুয়েট ’০৬',
    subject: 'পদার্থবিজ্ঞান মেন্টর',
    experience: '১৮ বছর+',
    students: '১৩ লক্ষ+',
    accent: '#4256BE',
    portrait: '/assets/teachers/masud-default.png',
    portraitHover: '/assets/teachers/masud-hover.png',
    book: '/assets/teachers/book-physics.png',
    achievements: ['দীর্ঘ ১৮ বছরের শিক্ষকতার অভিজ্ঞতা', 'বোর্ড ও ভর্তি প্রস্তুতিতে অভিজ্ঞ মেন্টর'],
    learn: ['সূত্রের সঠিক প্রয়োগ', 'সংখ্যাগত সমস্যা সমাধান', 'বাস্তব উদাহরণে ব্যাখ্যা', 'বোর্ড + ভর্তি প্রস্তুতি'],
    teachingStyle: [
      '🔬 বাস্তব উদাহরণে শেখানো',
      '📐 সূত্র বিশ্লেষণ',
      '🧮 ধাপে ধাপে সমাধান',
      '🎯 ধারণা থেকে শেখান',
    ],
  },
  {
    id: 'diba',
    name: 'দিবা চৌধুরী',
    academic: 'সিদ্ধেশ্বরী গার্লস কলেজ, ন্যাশনাল ইউনিভার্সিটি ’১৮',
    subject: 'ইংরেজি মেন্টর',
    experience: '৭ বছর+',
    students: '২ লক্ষ+',
    accent: '#21B0C5',
    portrait: '/assets/teachers/diba-default.png',
    portraitHover: '/assets/teachers/diba-hover.png',
    book: '/assets/teachers/book-english.png',
    achievements: ['ইংরেজি ভীতি দূর করতে বিশেষজ্ঞ', 'শিক্ষার্থীদের কাছে জনপ্রিয় মেন্টর'],
    learn: ['Grammar-এর মূল ভিত্তি', 'Vocabulary গড়ে তোলা', 'Writing skill উন্নয়ন', 'Reading comprehension'],
    teachingStyle: [
      '💬 সহজ ভাষায় ব্যাখ্যা',
      '📝 নিয়মিত অনুশীলনে গুরুত্ব',
      '🗣️ শেখার সাথে চর্চা',
      '⚡ পরীক্ষাভিত্তিক প্রস্তুতি',
    ],
  },
  {
    id: 'mehedi',
    name: 'আব্দুল্লাহ আল মেহেদী',
    academic: 'ব্র্যাক বিশ্ববিদ্যালয় ’১৫',
    subject: 'বাংলা মেন্টর',
    experience: '১৩ বছর+',
    students: '১৩ লক্ষ+',
    accent: '#B7302B',
    portrait: '/assets/teachers/mehedi-default.png',
    portraitHover: '/assets/teachers/mehedi-hover.png',
    book: '/assets/teachers/book-bangla.png',
    achievements: ['শত শত লাইভ ক্লাস পরিচালনা করেছেন', 'সৃজনশীল প্রশ্ন প্রস্তুতিতে অভিজ্ঞ'],
    learn: ['ব্যাকরণের মূল ভিত্তি', 'সাহিত্য বিশ্লেষণ', 'সৃজনশীল উত্তর লেখার কৌশল', 'বানান ও বাক্যগঠন'],
    teachingStyle: [
      '📖 সাহিত্য বিশ্লেষণ',
      '✍️ সৃজনশীল লেখার কৌশল',
      '💬 সহজ ভাষায় ব্যাখ্যা',
      '🔍 প্রশ্ন বিশ্লেষণ',
    ],
  },
];
