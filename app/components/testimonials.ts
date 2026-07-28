/**
 * Testimonial stories — shared by the section, the background player and the modal.
 *
 * `title` and `detail` are transcribed from the delivered thumbnails and the Figma
 * (132:11330), so they're real published copy.
 *
 * PLACEHOLDER: only story 1's quote card exists in the Figma. Stories 2–4 carry
 * generic `quote` / `author` lines pending the real words — they're deliberately
 * unattributed ("Shikho শিক্ষার্থী" rather than a name), because inventing a
 * specific quote and putting it in a named student's mouth isn't something that
 * should ship even as filler. Swap the marked fields when the real copy lands.
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
    id: 'mushfiq',
    youtubeId: 'xfyuT6Hndqo',
    title: 'সুন্দরবন থেকে নটরডেম, মুশফিকের স্বপ্ন পূরণের গল্প',
    quote: 'অল্প খরচে এতো ভালো টিচার, আমাদের স্বপ্নের চেয়ে বেশি, আশার চেয়ে বড়',
    author: 'মুশফিকের মা',
    detail: 'সুন্দরবনের বেকাদাশী থেকে SSC’25 এ GPA-5 অর্জন আর NDC তে চান্স',
    thumbnail: '/assets/testimonials/thumb-1.png',
  },
  {
    id: 'bandarban',
    youtubeId: '3G9PZbmo1Fk',
    title: 'বান্দরবান থেকে দুই বোন, স্বপ্ন পূরণের লক্ষ্যে Shikho-তে',
    // PLACEHOLDER quote + author
    quote: 'ঘরে বসেই দেশের সেরা শিক্ষকদের ক্লাস — এটাই আমাদের সবচেয়ে বড় পাওয়া।',
    author: 'Shikho শিক্ষার্থী',
    detail: 'বান্দরবান থেকে Shikho-র সাথে দুই বোনের পথচলা',
    thumbnail: '/assets/testimonials/thumb-2.png',
  },
  {
    id: 'nibir',
    youtubeId: 'kXhOclTnLLM',
    title: 'SSC ’২৫-এ ১,১৮৫ পেয়ে দেশসেরা Shikho স্টুডেন্ট নিবিড়',
    // PLACEHOLDER quote + author
    quote: 'নিয়মিত অনুশীলন আর সঠিক গাইডলাইন — এই দুটোই আমাকে সবচেয়ে বেশি এগিয়ে দিয়েছে।',
    author: 'Shikho শিক্ষার্থী',
    detail: 'SSC ’২৫-এ ১,১৮৫ নম্বর পেয়ে দেশসেরাদের একজন',
    thumbnail: '/assets/testimonials/thumb-3.png',
  },
  {
    id: 'alamin',
    youtubeId: 'oKqKVlJuDN8',
    title: 'পটুয়াখালীর বাউফল থেকে ঢাকা মেডিকেল কলেজ, আল-আমিনের স্বপ্ন জয়ের গল্প',
    // PLACEHOLDER quote + author
    quote: 'স্বপ্ন যদি বড় হয়, দূরত্ব কখনোই বাধা হয়ে দাঁড়ায় না।',
    author: 'Shikho শিক্ষার্থী',
    detail: 'পটুয়াখালীর বাউফল থেকে ঢাকা মেডিকেল কলেজে চান্স',
    thumbnail: '/assets/testimonials/thumb-4.png',
  },
];

/** YouTube's own still for a story — used as the poster under the background player */
export const posterFor = (s: Story) => `https://img.youtube.com/vi/${s.youtubeId}/maxresdefault.jpg`;
