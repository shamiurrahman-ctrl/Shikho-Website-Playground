export type MediaItem = {
  id: string;
  /** publication name — only ever read by assistive tech; the card shows the logo */
  outlet: string;
  logo: string;
  /** article screenshot revealed on hover, shown inside a browser frame */
  shot: string;
  headline: string;
  date: string;
  url: string;
};

/** Press coverage, newest first. Assets live in /public/assets/media. */
export const MEDIA: MediaItem[] = [
  {
    id: 'prothom-alo',
    outlet: 'Prothom Alo',
    logo: '/assets/media/prothom-alo.png',
    shot: '/assets/media/prothom-alo-shot.png',
    headline: 'শিখোতে যুক্ত হলেন চঞ্চল চৌধুরী',
    date: 'Aug 25, 2022',
    url: 'https://www.prothomalo.com/education/1l07gnc6rm',
  },
  {
    id: 'dhaka-tribune',
    outlet: 'Dhaka Tribune',
    logo: '/assets/media/dhaka-tribune.png',
    shot: '/assets/media/dhaka-tribune-shot.png',
    headline: 'Shikho becomes the first startup with $5.3M funding in Bangladesh',
    date: 'Mar 30, 2022',
    url: 'https://www.dhakatribune.com/business/266729/shikho-becomes-the-first-startup-with-5.3m',
  },
  {
    id: 'tech-in-asia',
    outlet: 'Tech in Asia',
    logo: '/assets/media/tech-in-asia.png',
    shot: '/assets/media/tech-in-asia-shot.png',
    headline: 'Wavemaker leads $4m round of Bangladeshi edtech startup',
    date: 'Mar 30, 2022',
    url: 'https://www.techinasia.com/wavemaker-leads-4m-seed-bangladeshi-edtech-startup-shikho',
  },
  {
    id: 'daily-star',
    outlet: 'The Daily Star',
    logo: '/assets/media/daily-star.png',
    shot: '/assets/media/daily-star-shot.png',
    headline: 'Bangladeshi edtech Shikho closes seed investment of USD 5.3 million',
    date: 'Dec 06, 2021',
    url: 'https://www.thedailystar.net/shout/news/bangladeshi-edtech-shikho-closes-seed-investment-usd-53-million-2993191',
  },
  {
    id: 'techcrunch',
    outlet: 'TechCrunch',
    logo: '/assets/media/techcrunch.png',
    shot: '/assets/media/techcrunch-shot.png',
    headline: 'Shikho, an edtech startup focused on Bangladesh’s students, gets $1.3M seed',
    date: 'Jul 29, 2021',
    url: 'https://techcrunch.com/2021/07/27/shikho-an-edtech-startup-focused-on-bangladeshs-students-gets-1-3m-seed/',
  },
  {
    id: 'trt-world',
    outlet: 'TRT World',
    logo: '/assets/media/trt-world.png',
    shot: '/assets/media/trt-world-shot.png',
    headline: 'Shikho: A startup revolutionising digital education in Bangladesh',
    date: 'Aug 14, 2021',
    url: 'https://www.trtworld.com/article/12762620?_rt=1',
  },
];
