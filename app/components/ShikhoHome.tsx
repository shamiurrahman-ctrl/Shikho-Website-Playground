'use client';

import { useEffect, useRef } from 'react';
import HeroSection from './HeroSection';

/**
 * Shikho homepage. The pinned hero is a reusable <HeroSection/> (rendered twice
 * for now so both a top and a below-stats variant can be compared). This shell
 * owns the shared page chrome (header, stats, feature grid, mentors, footer) and
 * a small controller for the header tone + stats cascade.
 */

const HEADER_MARKUP = `
<!-- ============ HEADER (shrinks into a floating glass pill on scroll) ============ -->
  <header id="siteHeader" class="tone-dark">
    <div id="hdrInner">
      <div id="hdrLogoBox">
        <img id="hdrLogoFull" src="/assets/shikho-logo-white.svg" alt="Shikho">
        <img id="hdrLogoBird" src="/assets/shikho-bird.svg" alt="Shikho">
      </div>
      <nav id="hdrNav">
        <a href="#">কোর্স</a>
        <a href="#">ফিচার</a>
        <a href="#">মেন্টর</a>
        <a href="#">ব্লগ</a>
      </nav>
      <div id="hdrCta">
        <a id="hdrLogin" href="#">লগ ইন</a>
        <a href="#" class="btn-3d btn-pink" style="font-family:'Hind Siliguri',sans-serif;font-size:15px;font-weight:700;color:#fff;text-decoration:none;white-space:nowrap;padding:12px 24px;border-radius:14px;">ফ্রি-তে শুরু করো</a>
      </div>
    </div>
  </header>
`;

const STATS_MARKUP = `
<!-- ============ WINDOW HERO → STATS (one continuous pinned section) ============ -->
  <section id="statsTrack" data-dark="1" style="position:relative;height:440vh;background:#050b26;z-index:1;">
    <div id="statsStage" style="position:sticky;top:0;height:100vh;overflow:hidden;">
      <!-- deep sky + sunrise glow -->
      <div style="position:absolute;inset:0;background:radial-gradient(120% 78% at 50% 122%,#ff8a3a 0%,#ff7c2e 7%,rgba(255,150,80,0) 46%),linear-gradient(180deg,#050b26 0%,#0a1a4e 32%,#155fce 70%,#4bb2ff 100%);"></div>

      <!-- hero content: title + buttons (left) and cloud-window (right) — fade/drift out on scroll -->
      <div id="hsText" style="position:absolute;left:7%;top:24%;max-width:660px;z-index:6;will-change:transform,opacity;">
        <h1 style="font-family:'Anek Bangla',sans-serif;font-weight:700;font-size:clamp(48px,5.8vw,88px);line-height:1.03;margin:0;color:#fff;letter-spacing:-.012em;text-shadow:0 2px 30px rgba(8,16,45,.45);">শেখাটা এখন<br>আরও স্মার্ট।</h1>
        <p style="font-family:'Hind Siliguri',sans-serif;font-size:clamp(17px,1.5vw,23px);color:#D7E0F5;margin:24px 0 0;max-width:540px;font-weight:400;line-height:1.6;text-shadow:0 1px 16px rgba(8,16,45,.4);">SSC ও HSC প্রস্তুতির সবচেয়ে স্মার্ট সঙ্গী — AI ক্লাস, ইনস্ট্যান্ট উত্তর আর পার্সোনালাইজড গাইডেন্স, সব এক অ্যাপে।</p>
        <div id="hsCta" style="display:flex;align-items:center;gap:14px;margin-top:28px;flex-wrap:wrap;will-change:transform,opacity,filter;">
          <a href="#" class="btn-3d btn-pink" style="font-family:'Hind Siliguri',sans-serif;font-size:17px;font-weight:700;color:#fff;text-decoration:none;white-space:nowrap;padding:18px 40px;border-radius:17px;">ফ্রি-তে শুরু করো</a>
          <a href="#" class="btn-3d btn-blue" style="display:inline-flex;align-items:center;gap:10px;font-family:'Hind Siliguri',sans-serif;font-size:17px;font-weight:700;color:#fff;text-decoration:none;white-space:nowrap;padding:18px 36px;border-radius:17px;"><span style="display:inline-flex;width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,.2);align-items:center;justify-content:center;font-size:11px;color:#fff;">▶</span>কোর্স দেখো</a>
        </div>
      </div>
      <img id="hsWindow" src="/assets/hero-window.png" alt="" style="position:absolute;right:5%;top:50%;transform:translateY(-50%);height:72vh;width:auto;max-width:42%;object-fit:contain;z-index:5;pointer-events:none;will-change:transform,opacity;filter:drop-shadow(0 30px 60px rgba(13,26,91,.18));">

      <!-- heading (fades in as the hero content leaves) -->
      <div id="statsHead" style="position:absolute;top:22%;left:0;right:0;text-align:center;z-index:3;padding:0 24px;will-change:transform,opacity;opacity:0;">
        <h2 style="font-family:'Anek Bangla',sans-serif;font-weight:700;font-size:clamp(32px,4.4vw,60px);line-height:1.05;margin:0;color:#fff;letter-spacing:-.012em;text-shadow:0 2px 30px rgba(4,9,38,.5);">লাখো শিক্ষার্থীর আস্থা</h2>
      </div>

      <!-- cascading cards -->
      <div id="statsGroup" style="position:absolute;left:50%;top:58%;width:1278px;height:363px;transform:translate(-50%,-50%);will-change:transform;">

        <!-- students (pink) -->
        <div class="scard" data-i="0" style="position:absolute;left:0px;top:0px;width:300px;height:363px;z-index:10;opacity:0;will-change:transform,opacity;">
          <div style="position:absolute;inset:0;border-radius:30px;overflow:hidden;box-shadow:0 26px 44px -8px rgba(4,9,38,.55);">
            <img src="/assets/stat-card-students.svg" alt="৩০ লক্ষ+ শিক্ষার্থী" style="position:absolute;inset:0;width:100%;height:100%;display:block;">
            <div class="scard-blur"></div>
          </div>
          <div style="position:absolute;top:30px;left:34px;right:20px;z-index:3;pointer-events:none;color:#e2008d;font-family:'Anek Bangla',sans-serif;"><div style="display:flex;align-items:flex-end;gap:9px;font-weight:700;letter-spacing:-.01em;"><span class="cnum" data-to="30" style="font-size:64px;line-height:.8;">০</span><span style="font-size:25px;font-weight:700;padding-bottom:7px;">লক্ষ+</span></div><div style="font-weight:600;font-size:24px;line-height:1.1;margin-top:6px;">শিক্ষার্থী</div></div>
        </div>

        <!-- mentors (green) -->
        <div class="scard" data-i="1" style="position:absolute;left:326px;top:0px;width:300px;height:363px;z-index:20;opacity:0;will-change:transform,opacity;">
          <div style="position:absolute;inset:0;border-radius:30px;overflow:hidden;box-shadow:0 26px 44px -8px rgba(4,9,38,.55);">
            <img src="/assets/stat-card-mentors.svg" alt="২০ জন+ অভিজ্ঞ মেন্টর" style="position:absolute;inset:0;width:100%;height:100%;display:block;">
            <div class="scard-blur"></div>
          </div>
          <div style="position:absolute;top:30px;left:34px;right:20px;z-index:3;pointer-events:none;color:#164f0d;font-family:'Anek Bangla',sans-serif;"><div style="display:flex;align-items:flex-end;gap:9px;font-weight:700;letter-spacing:-.01em;"><span class="cnum" data-to="20" style="font-size:64px;line-height:.8;">০</span><span style="font-size:25px;font-weight:700;padding-bottom:7px;">জন+</span></div><div style="font-weight:600;font-size:24px;line-height:1.1;margin-top:6px;">অভিজ্ঞ মেন্টর</div></div>
        </div>

        <!-- materials (dark) -->
        <div class="scard" data-i="2" style="position:absolute;left:652px;top:0px;width:300px;height:363px;z-index:30;opacity:0;will-change:transform,opacity;">
          <div style="position:absolute;inset:0;border-radius:30px;overflow:hidden;box-shadow:0 26px 44px -8px rgba(4,9,38,.55);">
            <img src="/assets/stat-card-materials.svg" alt="৫ লক্ষ+ লার্নিং ম্যাটেরিয়াল" style="position:absolute;inset:0;width:100%;height:100%;display:block;">
            <div class="scard-blur"></div>
          </div>
          <div style="position:absolute;top:30px;left:34px;right:20px;z-index:3;pointer-events:none;color:#ffffff;font-family:'Anek Bangla',sans-serif;"><div style="display:flex;align-items:flex-end;gap:9px;font-weight:700;letter-spacing:-.01em;"><span class="cnum" data-to="5" style="font-size:64px;line-height:.8;">০</span><span style="font-size:25px;font-weight:700;padding-bottom:7px;">লক্ষ+</span></div><div style="font-weight:600;font-size:24px;line-height:1.1;margin-top:6px;">লার্নিং ম্যাটেরিয়াল</div></div>
        </div>

        <!-- app downloads (blue) -->
        <div class="scard" data-i="3" style="position:absolute;left:978px;top:0px;width:300px;height:363px;z-index:40;opacity:0;will-change:transform,opacity;">
          <div style="position:absolute;inset:0;border-radius:30px;overflow:hidden;box-shadow:0 26px 44px -8px rgba(4,9,38,.55);">
            <img src="/assets/stat-card-downloads.svg" alt="৪৫ লক্ষ+ অ্যাপ ডাউনলোড" style="position:absolute;inset:0;width:100%;height:100%;display:block;">
            <div class="scard-blur"></div>
          </div>
          <div style="position:absolute;top:30px;left:34px;right:20px;z-index:3;pointer-events:none;color:#1e2b99;font-family:'Anek Bangla',sans-serif;"><div style="display:flex;align-items:flex-end;gap:9px;font-weight:700;letter-spacing:-.01em;"><span class="cnum" data-to="45" style="font-size:64px;line-height:.8;">০</span><span style="font-size:25px;font-weight:700;padding-bottom:7px;">লক্ষ+</span></div><div style="font-weight:600;font-size:24px;line-height:1.1;margin-top:6px;">অ্যাপ ডাউনলোড</div></div>
        </div>

      </div>
    </div>
  </section>
`;

const FEATURE_MARKUP = `
<!-- ============ CORE FEATURES (content over the dotted-white cloud background) ============ -->
  <section id="featTrack" data-dark="0" style="position:relative;height:560vh;margin-top:-100vh;z-index:2;">
    <div id="featStage" style="position:sticky;top:0;height:100vh;overflow:hidden;">

      <!-- three parallax cloud layers that fly up over the stats. base = top cloud + full white dotted section; mid + bottom = extra cloud volume that sweeps up faster. positions driven by the scroll loop. -->
      <img id="featBot" src="/assets/feature-bot.png" alt="" style="position:absolute;left:44%;top:0;width:56%;max-width:none;height:auto;z-index:0;pointer-events:none;will-change:transform;">
      <img id="featMid" src="/assets/feature-mid.png" alt="" style="position:absolute;left:60%;top:0;width:50%;max-width:none;height:auto;z-index:1;pointer-events:none;will-change:transform;">
      <img id="featBase" src="/assets/feature-base.png" alt="" style="position:absolute;left:-2%;top:0;width:104%;max-width:none;height:auto;z-index:2;pointer-events:none;will-change:transform;">

      <!-- content on the left -->
      <div id="featIntro" style="position:absolute;left:7%;top:14vh;max-width:600px;z-index:3;opacity:0;will-change:opacity;">
        <h2 style="font-family:'Anek Bangla',sans-serif;font-weight:700;font-size:clamp(28px,3.1vw,50px);line-height:1.12;margin:0;color:#161b33;letter-spacing:-.01em;">Shikho একাডেমিক প্রোগ্রামে<br>যা যা থাকছে</h2>
      </div>

      <div id="featList" style="position:absolute;left:7%;top:calc(14vh + 150px);width:min(42%,520px);z-index:3;opacity:0;will-change:opacity;">
        <div id="featProgTrack"></div>
        <div id="featProg"></div>
        <div class="fitem on" data-i="0"><div class="frow"><span class="fnum">০১</span><span class="flabel">লাইভ ক্লাস</span></div><div class="fbody"><p>সরাসরি ক্লাসে যুক্ত হও, প্রশ্ন করো — সাথে সাথেই উত্তর।</p></div></div>
        <div class="fitem" data-i="1"><div class="frow"><span class="fnum">০২</span><span class="flabel">স্মার্ট ক্লাস</span></div><div class="fbody"><p>রেকর্ডেড ভিডিও দেখো, AI দিয়ে যেকোনো অংশ বুঝে নাও।</p></div></div>
        <div class="fitem" data-i="2"><div class="frow"><span class="fnum">০৩</span><span class="flabel">অ্যানিমেটেড ভিডিও</span></div><div class="fbody"><p>কঠিন টপিকও সহজ হয়ে যায় প্রাণবন্ত অ্যানিমেশনে।</p></div></div>
        <div class="fitem" data-i="3"><div class="frow"><span class="fnum">০৪</span><span class="flabel">ই-বুক</span></div><div class="fbody"><p>ক্লাস নোট আর পিডিএফ — পুরো সিলেবাস এক জায়গায়।</p></div></div>
        <div class="fitem" data-i="4"><div class="frow"><span class="fnum">০৫</span><span class="flabel">কুইজ ও মডেল টেস্ট</span></div><div class="fbody"><p>প্রতিটা অধ্যায় শেষে নিজেকে যাচাই করো, যেকোনো সময়।</p></div></div>
        <div class="fitem" data-i="5"><div class="frow"><span class="fnum">০৬</span><span class="flabel">শিখো AI</span></div><div class="fbody"><p>প্রশ্ন লেখো বা ছবি তোলো — উত্তর মেলে তাৎক্ষণিক।</p></div></div>
      </div>

      <!-- phone + floating elements sit over the blob (baked into the background) -->
      <div id="featPhone" style="position:absolute;left:78%;top:14vh;transform:translateX(-50%);z-index:2;opacity:0;will-change:transform,opacity;">
        <img src="/assets/feature-phone.png" alt="" style="height:82vh;width:auto;display:block;">
        <img id="featCard" src="/assets/feature-card.png" alt="" style="position:absolute;left:-24%;top:30%;width:62%;height:auto;z-index:4;will-change:transform;filter:drop-shadow(0 22px 40px rgba(13,26,91,.18));">
        <img id="featDate" src="/assets/feature-date.png" alt="" style="position:absolute;right:-14%;bottom:12%;width:56%;height:auto;z-index:4;will-change:transform;filter:drop-shadow(0 22px 40px rgba(13,26,91,.18));">
      </div>
    </div>
  </section>
`;

const REST_MARKUP = `
<!-- ============ SECONDARY FEATURE GRID ============ -->
  <section data-dark="0" style="padding:96px 40px;background:#FBFAF7;">
    <div style="max-width:1100px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:48px;">
        <div style="font-family:'Hind Siliguri';font-size:14px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#E2008D;margin-bottom:12px;">আরও যা পাবে</div>
        <h2 style="font-family:'Anek Bangla';font-weight:700;font-size:clamp(30px,3.6vw,48px);margin:0;color:#161B33;">একটি অ্যাপ, সবকিছু এক জায়গায়</h2>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:20px;">
        <div style="background:#fff;border-radius:22px;padding:30px;box-shadow:0 10px 30px rgba(22,27,51,.05);border:1px solid #EEF0F6;">
          <div style="width:48px;height:48px;border-radius:14px;background:#EEF2FB;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:18px;">🔍</div>
          <h3 style="font-family:'Hind Siliguri';font-size:21px;font-weight:700;margin:0 0 8px;">সার্চ + এক্সপ্লোর</h3>
          <p style="font-family:'Hind Siliguri';font-size:15px;line-height:1.6;color:#4A5270;margin:0;">টাইপ করে, ভয়েসে বা ব্রাউজ করে — যেকোনো চ্যাপ্টার, ক্লাস, মেন্টর বা ই-বুক মুহূর্তেই খুঁজে নাও।</p>
        </div>
        <div style="background:#fff;border-radius:22px;padding:30px;box-shadow:0 10px 30px rgba(22,27,51,.05);border:1px solid #EEF0F6;">
          <div style="width:48px;height:48px;border-radius:14px;background:#FFE4EF;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:18px;">📖</div>
          <h3 style="font-family:'Hind Siliguri';font-size:21px;font-weight:700;margin:0 0 8px;">ই-বুক</h3>
          <p style="font-family:'Hind Siliguri';font-size:15px;line-height:1.6;color:#4A5270;margin:0;">ডিজিটাল টেক্সটবুক, ফ্ল্যাশকার্ড আর MCQ ব্যাংক — গল্পভিত্তিক ও সারাংশ আকারে সাজানো।</p>
        </div>
        <div style="background:#fff;border-radius:22px;padding:30px;box-shadow:0 10px 30px rgba(22,27,51,.05);border:1px solid #EEF0F6;">
          <div style="width:48px;height:48px;border-radius:14px;background:#FFF1D6;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:18px;">♾️</div>
          <h3 style="font-family:'Hind Siliguri';font-size:21px;font-weight:700;margin:0 0 8px;">আর্কাইভ কোর্স অ্যাক্সেস</h3>
          <p style="font-family:'Hind Siliguri';font-size:15px;line-height:1.6;color:#4A5270;margin:0;">কোর্সের মেয়াদ শেষ হলেও কেনা কোর্স থাকবে চিরকাল — যখন খুশি ফিরে দেখো।</p>
        </div>
        <div style="background:#fff;border-radius:22px;padding:30px;box-shadow:0 10px 30px rgba(22,27,51,.05);border:1px solid #EEF0F6;">
          <div style="width:48px;height:48px;border-radius:14px;background:#DEF7EA;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:18px;">📱</div>
          <h3 style="font-family:'Hind Siliguri';font-size:21px;font-weight:700;margin:0 0 8px;">FutureBook</h3>
          <p style="font-family:'Hind Siliguri';font-size:15px;line-height:1.6;color:#4A5270;margin:0;">QR-লিংক করা FutureLink দিয়ে তোমার বই আর অ্যাপ এক সুতোয় বাঁধা — ভিডিও দেখা ও টিউশনের অগ্রগতি একসাথে ট্র্যাক হয়।</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ MENTORS (stub) ============ -->
  <section data-dark="0" style="padding:96px 40px;background:#F1F4FB;">
    <div style="max-width:1100px;margin:0 auto;text-align:center;">
      <div style="font-family:'Hind Siliguri';font-size:14px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#E2008D;margin-bottom:12px;">মেন্টর</div>
      <h2 style="font-family:'Anek Bangla';font-weight:700;font-size:clamp(30px,3.6vw,48px);margin:0 0 14px;color:#161B33;">দেশসেরা শিক্ষকদের কাছে শেখো</h2>
      <p style="font-family:'Hind Siliguri';font-size:17px;color:#4A5270;max-width:560px;margin:0 auto 44px;">যাঁরা হাজারো শিক্ষার্থীকে স্বপ্নের প্রতিষ্ঠানে পৌঁছে দিয়েছেন।</p>
      <div style="display:flex;justify-content:center;gap:22px;flex-wrap:wrap;">
        <div style="width:200px;background:#fff;border-radius:18px;padding:22px;box-shadow:0 8px 24px rgba(22,27,51,.06);"><div style="width:72px;height:72px;border-radius:50%;margin:0 auto 14px;background:linear-gradient(135deg,#355DAB,#E2008D);"></div><div style="font-family:'Hind Siliguri';font-size:16px;font-weight:700;">আরিফ স্যার</div><div style="font-family:'Hind Siliguri';font-size:13px;color:#6E7691;margin-top:3px;">পদার্থবিজ্ঞান · BUET</div></div>
        <div style="width:200px;background:#fff;border-radius:18px;padding:22px;box-shadow:0 8px 24px rgba(22,27,51,.06);"><div style="width:72px;height:72px;border-radius:50%;margin:0 auto 14px;background:linear-gradient(135deg,#FAA700,#FF1C5A);"></div><div style="font-family:'Hind Siliguri';font-size:16px;font-weight:700;">তানিয়া ম্যাম</div><div style="font-family:'Hind Siliguri';font-size:13px;color:#6E7691;margin-top:3px;">রসায়ন · DU</div></div>
        <div style="width:200px;background:#fff;border-radius:18px;padding:22px;box-shadow:0 8px 24px rgba(22,27,51,.06);"><div style="width:72px;height:72px;border-radius:50%;margin:0 auto 14px;background:linear-gradient(135deg,#2D4797,#FAA700);"></div><div style="font-family:'Hind Siliguri';font-size:16px;font-weight:700;">সাব্বির স্যার</div><div style="font-family:'Hind Siliguri';font-size:13px;color:#6E7691;margin-top:3px;">গণিত · BUET</div></div>
      </div>
      <div style="font-family:'Hind Siliguri';font-size:13px;color:#9aa2bd;margin-top:30px;">+ আরও ২০ জন অভিজ্ঞ মেন্টর</div>
    </div>
  </section>

  <!-- ============ FOOTER (stub) ============ -->
  <footer data-dark="1" style="background:#0E1430;padding:64px 40px 40px;">
    <div style="max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:30px;">
      <div style="max-width:320px;">
        <img src="/assets/shikho-logo-white.svg" alt="Shikho" style="height:32px;margin-bottom:16px;">
        <p style="font-family:'Hind Siliguri';font-size:14px;line-height:1.6;color:#9aa2bd;margin:0 0 18px;">SSC ও HSC প্রস্তুতির সবচেয়ে স্মার্ট সঙ্গী। আজই অ্যাপ ডাউনলোড করো।</p>
        <div style="display:flex;gap:10px;"><span style="font-family:'Hind Siliguri';font-size:13px;font-weight:600;color:#0E1430;background:#fff;padding:9px 16px;border-radius:10px;"> App Store</span><span style="font-family:'Hind Siliguri';font-size:13px;font-weight:600;color:#0E1430;background:#fff;padding:9px 16px;border-radius:10px;">▶ Google Play</span></div>
      </div>
      <div style="display:flex;gap:56px;flex-wrap:wrap;font-family:'Hind Siliguri';">
        <div><div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:14px;">কোম্পানি</div><div style="display:flex;flex-direction:column;gap:10px;font-size:13px;color:#9aa2bd;"><span>আমাদের সম্পর্কে</span><span>ক্যারিয়ার</span><span>ব্লগ</span></div></div>
        <div><div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:14px;">সহায়তা</div><div style="display:flex;flex-direction:column;gap:10px;font-size:13px;color:#9aa2bd;"><span>হেল্পলাইন ১৬৭৮০</span><span>FAQ</span><span>যোগাযোগ</span></div></div>
      </div>
    </div>
    <div style="max-width:1100px;margin:40px auto 0;padding-top:24px;border-top:1px solid rgba(255,255,255,.1);font-family:'Hind Siliguri';font-size:12px;color:#6E7691;">© ২০২৬ Shikho Technologies Ltd.</div>
  </footer>
`;

export default function ShikhoHome() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const mc = (v: number, a: number, b: number) => clamp((v - a) / (b - a), 0, 1);
    const eo = (t: number) => 1 - Math.pow(1 - t, 3);
    const bn = (n: number | string) => String(n).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);

    // per-word blur reveal (appear) + blur-out (disappear), driven by scroll progress
    const wordFx = (
      words: HTMLElement[], sp: number,
      aS: number, aE: number, aStag: number,
      dS: number | null, dE: number, dStag: number
    ) => {
      words.forEach((w, i) => {
        const ap = mc(sp, aS + i * aStag, aE + i * aStag);
        const dp = dS == null ? 0 : mc(sp, dS + i * dStag, dE + i * dStag);
        w.style.opacity = String(ap * (1 - dp));
        const blur = (1 - ap) * 10 + dp * 10;
        w.style.filter = blur < 0.05 ? 'none' : `blur(${blur.toFixed(2)}px)`;
        w.style.transform = `translateY(${(1 - eo(ap)) * 16 + dp * -16}px)`;
      });
    };

    const q = <T extends Element = HTMLElement>(s: string) => root.querySelector(s) as T | null;
    const qa = (s: string) => Array.from(root.querySelectorAll(s)) as HTMLElement[];

    root.style.setProperty('--accent', '#FAA700');

    // ---- header (shared across both hero instances) ----
    const siteHeader = q('#siteHeader');
    const hdrLogoBox = q('#hdrLogoBox');
    const hdrLogoFull = q<HTMLImageElement>('#hdrLogoFull');
    const hdrLogoBird = q<HTMLImageElement>('#hdrLogoBird');
    const heroTracks = qa('#track'); // one per <HeroSection/>
    const hdrZones = qa('[data-dark]').map((z) => ({ el: z, d: +(z.getAttribute('data-dark') || 0) }));
    let hdrDark = 1;

    // ---- window-hero → stats cascade (one pinned section) ----
    const statsTrack = q('#statsTrack');
    const statsStage = q('#statsStage');
    const statsHead = q('#statsHead');
    const statsGroup = q('#statsGroup');
    const scards = qa('.scard');
    const hsText = q('#hsText');
    const hsWindow = q('#hsWindow');
    const hsCta = q('#hsCta');

    // ---- core features (accordion + phone) ----
    const featTrack = q('#featTrack');
    const featBase = q('#featBase');
    const featMid = q('#featMid');
    const featBot = q('#featBot');
    const featIntro = q('#featIntro');
    const featList = q('#featList');
    const featProgTrack = q('#featProgTrack');
    const featProg = q('#featProg');
    const fitems = qa('.fitem');
    const featPhone = q('#featPhone');
    const featCard = q('#featCard');
    const featDate = q('#featDate');
    let activeFeat = -1;

    // split text into per-word spans (same blur-reveal mechanism as the hero)
    const wrapWords = (node: Element | null): HTMLElement[] => {
      if (!node) return [];
      // idempotent: if already wrapped (StrictMode/HMR re-run), reuse existing spans
      if (node.querySelector('.bw')) return Array.from(node.querySelectorAll('.bw')) as HTMLElement[];
      const lines = node.innerHTML.split(/<br\s*\/?>/i);
      node.innerHTML = lines
        .map((line) =>
          line
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map(
              (w) =>
                `<span class="bw" style="display:inline-block;white-space:pre;will-change:filter,transform,opacity;">${w}</span>`
            )
            .join(' ')
        )
        .join('<br>');
      return Array.from(node.querySelectorAll('.bw')) as HTMLElement[];
    };
    const hsTitleWords = wrapWords(q('#hsText h1'));
    const hsSubWords = wrapWords(q('#hsText p'));
    const headWords = wrapWords(q('#statsHead h2'));
    const featTitleWords = wrapWords(q('#featIntro h2'));
    if (featTitleWords[0]) featTitleWords[0].style.color = '#3b4ee3'; // keep "Shikho" in the brand indigo

    const render = () => {
      const vh = window.innerHeight;

      if (siteHeader) {
        const scrolled = window.scrollY > 56;
        siteHeader.classList.toggle('scrolled', scrolled);

        const sampleY = 46;
        let targetDark = 0;
        let overHero = false;
        for (const t of heroTracks) {
          const r = t.getBoundingClientRect();
          if (r.top <= sampleY && r.bottom > sampleY) {
            const travel = t.offsetHeight - vh;
            const P = clamp(-r.top / travel, 0, 1) * 8;
            targetDark = 1 - mc(P, 1.4, 2.05); // dark hero -> light gradient
            overHero = true;
            break;
          }
        }
        if (!overHero) {
          for (const z of hdrZones) {
            const r = z.el.getBoundingClientRect();
            if (r.top <= sampleY && r.bottom > sampleY) {
              targetDark = z.d;
              break;
            }
          }
        }
        hdrDark += (targetDark - hdrDark) * 0.15;
        const dark = hdrDark > 0.5;
        siteHeader.classList.toggle('tone-dark', dark);
        siteHeader.classList.toggle('tone-light', !dark);

        if (hdrLogoBox) {
          const fullW = hdrLogoFull?.offsetWidth || 150;
          const birdW = hdrLogoBird?.offsetWidth || 34;
          if (fullW > 1) hdrLogoBox.style.width = (scrolled ? birdW : fullW) + 'px';
        }
      }

      if (statsTrack && statsGroup) {
        const vw = window.innerWidth;
        const st = statsTrack.getBoundingClientRect();
        const sTravel = statsTrack.offsetHeight - vh;
        const sp = clamp(-st.top / sTravel, 0, 1);

        // phase 1: window-hero title + subtitle — word-by-word blur reveal in, then blur out
        wordFx(hsTitleWords, sp, 0.0, 0.07, 0.02, 0.22, 0.3, 0.02);
        wordFx(hsSubWords, sp, 0.04, 0.12, 0.006, 0.2, 0.3, 0.008);
        if (hsCta) {
          const ap = mc(sp, 0.08, 0.18);
          const dp = mc(sp, 0.22, 0.32);
          hsCta.style.opacity = String(ap * (1 - dp));
          const blur = (1 - ap) * 8 + dp * 8;
          hsCta.style.filter = blur < 0.05 ? 'none' : `blur(${blur.toFixed(2)}px)`;
          hsCta.style.transform = `translateY(${(1 - eo(ap)) * 16 + dp * -16}px)`;
        }
        if (hsText) hsText.style.visibility = mc(sp, 0.2, 0.4) >= 1 ? 'hidden' : 'visible';
        if (hsWindow) {
          const out = mc(sp, 0.24, 0.4);
          hsWindow.style.opacity = String(1 - out);
          hsWindow.style.transform = `translate(${lerp(0, 90, eo(out))}px,-50%) scale(${lerp(1, 0.9, out)})`;
          hsWindow.style.visibility = out >= 1 ? 'hidden' : 'visible';
        }

        // phase 2: heading (word blur-in) + stat cards rise in
        const gscale = clamp(Math.min((vw - 80) / 1278, (vh - 240) / 363), 0.4, 1);
        statsGroup.style.transform = `translate(-50%,-50%) scale(${gscale})`;
        if (statsHead) statsHead.style.opacity = '1';
        wordFx(headWords, sp, 0.44, 0.56, 0.03, null, 0, 0);
        // cards rise AFTER the window hero clears (~0.4), settle by ~0.64, then hold
        // while the feature section rises up over them (last ~30% of this track)
        scards.forEach((c, i) => {
          const t = eo(clamp((sp - 0.42 - i * 0.03) / 0.13, 0, 1));
          c.style.opacity = String(clamp(t * 1.5, 0, 1));
          c.style.transform = `translateY(${lerp(300 + i * 26, 0, t)}px) scale(${lerp(0.9, 1, t)})`;
          // count the number up (0 → target) as the card rises
          const cn = c.querySelector('.cnum') as HTMLElement | null;
          if (cn) {
            const to = +(cn.dataset.to || 0);
            cn.textContent = bn(Math.round(to * t));
          }
        });
      }

      // ---- core features: staged entrance, then the accordion advances ----
      if (featTrack && fitems.length) {
        const ft = featTrack.getBoundingClientRect();
        const fTravel = featTrack.offsetHeight - vh;
        const fp = clamp(-ft.top / fTravel, 0, 1);

        // Freeze the stats so it doesn't move a pixel while the clouds fly over it. A JS
        // counter-transform can't cancel compositor scrolling (lags a frame → jump), so pin it
        // on the compositor with position:fixed. Engage the moment the stats reach the top
        // (statsTrack.top ≤ 0) — the sticky is pinned at top:0 there so the swap is seamless,
        // AND it happens at the stats' entry, far from the cloud transition. Stays fixed right
        // through the transition (no layout change during it), then hands back to sticky once
        // the white section has covered it. Only touch styles on state change.
        if (statsStage && statsTrack) {
          const el = statsStage as HTMLElement;
          const pinned = statsTrack.getBoundingClientRect().top <= 0 && fp < 0.5;
          if (pinned && el.dataset.frozen !== '1') {
            el.dataset.frozen = '1';
            el.style.position = 'fixed';
            el.style.top = '0';
            el.style.left = '0';
            el.style.width = '100%';
          } else if (!pinned && el.dataset.frozen === '1') {
            el.dataset.frozen = '0';
            el.style.position = 'sticky';
            el.style.left = '';
            el.style.width = '';
          }
        }

        // 1) clouds fly up from below over the stats. base (TOP cloud + full white section)
        // is in front and rises so its cloud SURPASSES the whole stats (white body fills to
        // the top). mid + bottom are smaller puffs behind, faster, for parallax depth.
        // Layered parallax: each cloud enters at its OWN time and moves at its OWN speed, with a
        // subtle scroll-driven horizontal drift (a different phase each) so they never align.
        // Bottom enters first & slowest (0.55x); Middle next & medium (0.8x); the Top — which
        // carries the white feature section — enters last & fastest (1.15x) and overtakes to
        // cover the others. Each has an independent translate3d (never grouped).
        const drift = (amp: number, ph: number) => (amp * Math.sin(fp * 7 + ph)).toFixed(1);
        if (featBot) {
          const y = lerp(120, -35, mc(fp, 0.02, 0.56)); // enters FIRST and rises well up into view
          featBot.style.transform = `translate3d(${drift(8, 0)}px, ${y}vh, 0)`;
        }
        if (featMid) {
          const y = lerp(120, -62, mc(fp, 0.13, 0.53)); // enters ~25%, medium — rises well above
          featMid.style.transform = `translate3d(${drift(12, 2.4)}px, ${y}vh, 0)`;
        }
        if (featBase) {
          // enters ~40%, fastest — overtakes and settles so the white section fills to the
          // bottom (covering the others fully) with its cloud lifted above. baseH from width
          // (104%, aspect 2880:3158) so we never read offsetHeight in the loop (layout thrash).
          const baseH = 1.1404 * document.documentElement.clientWidth;
          const settleY = Math.max(vh - baseH + 6, -0.35 * baseH);
          const y = lerp(1.10 * vh, settleY, mc(fp, 0.23, 0.48));
          featBase.style.transform = `translate3d(${drift(15, 4.8)}px, ${y}px, 0)`;
        }

        // 2) once the top cloud has taken over, the phone rises + fades in
        const pPhone = mc(fp, 0.48, 0.62);
        if (featPhone) {
          featPhone.style.opacity = String(pPhone);
          featPhone.style.transform = `translateX(-50%) translateY(${lerp(44, 0, pPhone)}px)`;
        }
        // 3) the title does its per-word blur reveal, then the feature items blur in from the
        //    LEFT, one after another (staggered), like the list assembling itself.
        if (featIntro) {
          featIntro.style.opacity = '1';
          wordFx(featTitleWords, fp, 0.52, 0.64, 0.013, null, 0, 0);
        }
        if (featList) (featList as HTMLElement).style.opacity = '1';
        fitems.forEach((it, i) => {
          const p = eo(mc(fp, 0.54 + i * 0.018, 0.63 + i * 0.018));
          const el = it as HTMLElement;
          el.style.opacity = String(p);
          const blur = (1 - p) * 8;
          el.style.filter = blur < 0.05 ? 'none' : `blur(${blur.toFixed(2)}px)`;
          el.style.transform = `translateX(${((1 - p) * -46).toFixed(1)}px)`;
        });
        // 4) the active step advances as you scroll on (after the items have assembled)
        const pBeats = mc(fp, 0.74, 0.96);
        const segf = pBeats * (fitems.length - 1);   // 0 .. n-1
        const active = clamp(Math.floor(segf), 0, fitems.length - 1);
        const fillFrac = clamp(segf - active, 0, 1);  // progress toward the next step
        // the progress line fades in with its active item's reveal
        const activeRevealP = eo(mc(fp, 0.54 + active * 0.018, 0.63 + active * 0.018));
        if (active !== activeFeat) {
          activeFeat = active;
          fitems.forEach((it, i) => it.classList.toggle('on', i === active));
        }
        // progress line: only between the active badge and the next, filling as you scroll
        if (featProgTrack && featProg) {
          const last = active >= fitems.length - 1;
          if (last) {
            featProgTrack.style.opacity = '0';
            featProg.style.opacity = '0';
          } else {
            const cur = fitems[active] as HTMLElement;
            const nxt = fitems[active + 1] as HTMLElement;
            const top = cur.offsetTop + 52;             // just below the active badge
            const h = Math.max(0, (nxt.offsetTop - 4) - top); // stop just above the next badge
            featProgTrack.style.opacity = String(activeRevealP);
            featProgTrack.style.top = top + 'px';
            featProgTrack.style.height = h + 'px';
            featProg.style.opacity = String(activeRevealP);
            featProg.style.top = top + 'px';
            featProg.style.height = h * fillFrac + 'px';
          }
        }
        // floating cards keep a gentle parallax relative to the phone
        if (featCard) featCard.style.transform = `translateY(${lerp(16, -16, fp)}px)`;
        if (featDate) featDate.style.transform = `translateY(${lerp(-14, 14, fp)}px)`;
      }
    };

    let raf = requestAnimationFrame(function loop() {
      render();
      raf = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={rootRef} style={{ position: 'relative', background: '#FBFAF7' }}>
      <div dangerouslySetInnerHTML={{ __html: HEADER_MARKUP }} />
      <HeroSection />
      <div dangerouslySetInnerHTML={{ __html: STATS_MARKUP }} />
      <div dangerouslySetInnerHTML={{ __html: FEATURE_MARKUP }} />
      <div dangerouslySetInnerHTML={{ __html: REST_MARKUP }} />
    </div>
  );
}
