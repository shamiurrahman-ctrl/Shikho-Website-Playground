/**
 * Testimonial stories — shared by the section, the background player and the modal.
 *
 * All four entries carry real supplied copy; nothing here is placeholder.
 *
 * THUMBNAIL MAPPING: each thumbnail image has its story's headline printed on it,
 * so they're matched by content rather than by filename. The delivered files are
 * numbered in the reverse of this running order — thumb-4 is আল আমিন (story 1) and
 * thumb-1 is মুশফিক (story 4) — so don't "correct" these to sequential order.
 *
 * `videoSrc` is the preferred background source. While it's empty the player falls
 * back to a muted, chrome-less YouTube embed; dropping an .mp4 path in here
 * switches that story to a native <video> with no other changes.
 */

export type Story = {
  id: string;
  /** YouTube id — drives the modal, the poster frame and the fallback background */
  youtubeId: string;
  title: string;
  quote: string;
  author: string;
  detail: string;
  thumbnail: string;
  /** local mp4, when available — takes precedence over the YouTube background */
  videoSrc?: string;
};

export const STORIES: Story[] = [
  {
    id: 'alamin',
    youtubeId: 'xfyuT6Hndqo',
    title: 'পটুয়াখালীর বাউফল থেকে ঢাকা মেডিকেল কলেজ! আল আমিন-এর স্বপ্ন জয়ের গল্প',
    quote: '“HSC’র গুরুত্ব আর কীভাবে কী করতে হবে তা Shikho’র টিচারদের থেকে বুঝতে পেরেছি”',
    author: 'আল আমিন',
    detail: 'পটুয়াখালীর বাউফল থেকে ২০২৪ মেডিকেল এডমিশন - ১১৭ তম',
    thumbnail: '/assets/testimonials/thumb-4.png',
  },
  {
    id: 'nibir',
    youtubeId: '3G9PZbmo1Fk',
    title: 'SSC ‘২৫-এ ১,২৮৫ পেয়ে দেশের সেরা Shikho’র স্টুডেন্ট নিবিড়!',
    quote: '“প্রতিটা কনসেপ্ট ক্লিয়ার করতে আমাকে অনেক বেশি হেল্প করেছে অ্যানিমেটেড লেসনগুলো”',
    author: 'নিবিড় কর্মকার',
    detail: 'Academic Program’25 SSC’25-এ সারাদেশে ১ম স্থান অর্জনকারী (প্রাপ্ত নম্বর- ১২৮৫)',
    thumbnail: '/assets/testimonials/thumb-3.png',
  },
  {
    id: 'israt',
    youtubeId: 'kXhOclTnLLM',
    title: 'বান্দরবান থেকে দুই বোন! স্বপ্ন পূরণের লক্ষ্যে Shikho-তে!',
    quote:
      '“লাইভ ক্লাসে অ্যাডভান্সড প্রবলেম সলভিং করায়, এতে এডমিশন টেস্টের প্রশ্ন কলেজ লাইফেই শিখে যাচ্ছি”',
    author: 'ইসরাত',
    detail: 'বান্দরবান থেকে স্বপ্ন পূরণের লক্ষ্যে HSC ’26 একাডেমিক প্রোগ্রামে',
    thumbnail: '/assets/testimonials/thumb-2.png',
  },
  {
    id: 'mushfiq',
    youtubeId: 'oKqKVlJuDN8',
    title: 'সুন্দরবন থেকে নটরডেম! মুশফিকের স্বপ্ন পূরণের গল্প!',
    quote: '“অল্প খরচে এত ভালো টিচার, আমাদের স্বপ্নের চেয়ে বেশি, আশার চেয়ে বড়”',
    author: 'মুশফিক-এর মা',
    detail: 'সুন্দরবনের বেকাদাসী থেকে SSC ’25-এ GPA-5 অর্জন আর NDC-তে চান্স',
    thumbnail: '/assets/testimonials/thumb-1.png',
  },
];

/** YouTube's own still for a story — used as the poster under the background player */
export const posterFor = (s: Story) => `https://img.youtube.com/vi/${s.youtubeId}/maxresdefault.jpg`;
