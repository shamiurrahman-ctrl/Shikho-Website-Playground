'use client';

import { useEffect, useRef } from 'react';

/**
 * Shikho homepage — pinned, scroll-driven hero + 6-feature scrollytelling,
 * followed by stats / feature grid / mentors / footer.
 *
 * The markup mirrors the reference design (Shikho Home.dc.html) and the
 * animation engine below is a TypeScript port of that reference's rAF loop:
 * one scroll progress value (0..1 over the pinned track) is expanded to
 * P = prog * 8 — hero (0–1), home showcase (1–2), feature beats (2–8).
 */

const MARKUP = `
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

  <!-- ============ PINNED SCROLL TRACK ============ -->
  <section id="track" style="position:relative;height:900vh;">
    <div id="stage" style="position:sticky;top:0;height:100vh;overflow:hidden;background:linear-gradient(180deg,#CADFF4 0%,#DCE9F7 32%,#EFE9F0 58%,#FBEEDB 80%,#FEF6EC 100%);">

      <!-- dark sunset sky (hero) — fades out as the feature tour begins -->
      <img id="heroBg" src="/assets/hero-bg.png" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;will-change:opacity;pointer-events:none;">

      <!-- clouds back -->
      <div id="cloudsBack" style="position:absolute;inset:-6% -6% 0 -6%;will-change:transform,opacity;display:none;">
        <div style="position:absolute;left:6%;top:30%;width:46%;height:30%;border-radius:50%;background:radial-gradient(ellipse 60% 60% at 50% 50%,rgba(255,255,255,.9),rgba(255,255,255,0) 70%);filter:blur(6px);animation:driftBack 42s ease-in-out infinite alternate;"></div>
        <div style="position:absolute;left:48%;top:14%;width:52%;height:34%;border-radius:50%;background:radial-gradient(ellipse 60% 60% at 50% 50%,rgba(255,255,255,.82),rgba(255,255,255,0) 70%);filter:blur(7px);animation:driftBack 52s ease-in-out infinite alternate-reverse;"></div>
        <div style="position:absolute;left:-4%;top:52%;width:40%;height:26%;border-radius:50%;background:radial-gradient(ellipse 60% 60% at 50% 50%,rgba(255,255,255,.75),rgba(255,255,255,0) 70%);filter:blur(8px);animation:driftBack 60s ease-in-out infinite alternate;"></div>
      </div>
      <!-- clouds front -->
      <div id="cloudsFront" style="position:absolute;inset:0 -8% -4% -8%;will-change:transform,opacity;">
        <div style="position:absolute;left:2%;top:62%;width:48%;height:30%;border-radius:50%;background:radial-gradient(ellipse 58% 55% at 50% 50%,rgba(255,255,255,.98),rgba(255,255,255,0) 68%);filter:blur(4px);animation:driftFront 30s ease-in-out infinite alternate;"></div>
        <div style="position:absolute;left:54%;top:66%;width:50%;height:32%;border-radius:50%;background:radial-gradient(ellipse 58% 55% at 50% 50%,rgba(255,255,255,.96),rgba(255,255,255,0) 68%);filter:blur(5px);animation:driftFront 36s ease-in-out infinite alternate-reverse;"></div>
        <div style="position:absolute;left:28%;top:78%;width:46%;height:30%;border-radius:50%;background:radial-gradient(ellipse 58% 50% at 50% 50%,rgba(255,255,255,1),rgba(255,255,255,0) 66%);filter:blur(3px);animation:driftFront 26s ease-in-out infinite alternate;"></div>
      </div>

      <!-- warm glow behind phone -->
      <div id="glow" style="position:absolute;left:64%;top:63%;width:760px;height:760px;transform:translate(-50%,-50%) scale(.7);border-radius:50%;background:radial-gradient(circle at 50% 50%,rgba(250,167,0,.55),rgba(255,28,90,.18) 42%,rgba(255,255,255,0) 66%);opacity:0;will-change:opacity,transform;pointer-events:none;"></div>

      <!-- hero text -->
      <div id="heroText" style="position:absolute;left:7%;right:auto;top:21%;text-align:left;z-index:50;will-change:transform,opacity;max-width:660px;">
        <div id="heroTitleSlot" style="position:relative;">
          <div id="heroBig" style="will-change:opacity,transform;">
            <h1 style="font-family:'Anek Bangla',sans-serif;font-weight:700;font-size:clamp(48px,5.8vw,88px);line-height:1.03;margin:0;color:#fff;letter-spacing:-.012em;text-shadow:0 2px 30px rgba(8,16,45,.45);">শেখাটা এখন<br>আরও স্মার্ট।</h1>
            <p style="font-family:'Hind Siliguri',sans-serif;font-size:clamp(17px,1.5vw,23px);color:#D7E0F5;margin:24px 0 0;max-width:540px;font-weight:400;line-height:1.6;text-shadow:0 1px 16px rgba(8,16,45,.4);">SSC ও HSC প্রস্তুতির সবচেয়ে স্মার্ট সঙ্গী — AI ক্লাস, ইনস্ট্যান্ট উত্তর আর পার্সোনালাইজড গাইডেন্স, সব এক অ্যাপে।</p>
          </div>
          <h2 id="heroSingle" style="position:absolute;left:0;top:0;margin:0;opacity:0;font-family:'Anek Bangla',sans-serif;font-weight:700;font-size:clamp(40px,4.6vw,64px);line-height:1.05;letter-spacing:-.012em;color:#fff;will-change:opacity;">লাখো শিক্ষার্থীর আস্থা।</h2>
        </div>
        <div id="heroLower" style="will-change:transform;">
        <div id="heroCtaRow" style="display:flex;align-items:center;gap:14px;margin-top:22px;flex-wrap:wrap;">
          <a href="#" class="btn-3d btn-pink" style="font-family:'Hind Siliguri',sans-serif;font-size:17px;font-weight:700;color:#fff;text-decoration:none;white-space:nowrap;padding:18px 40px;border-radius:17px;">ফ্রি-তে শুরু করো</a>
          <a href="#" class="btn-3d btn-blue" style="display:inline-flex;align-items:center;gap:10px;font-family:'Hind Siliguri',sans-serif;font-size:17px;font-weight:700;color:#fff;text-decoration:none;white-space:nowrap;padding:18px 36px;border-radius:17px;"><span style="display:inline-flex;width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,.2);align-items:center;justify-content:center;font-size:11px;color:#fff;">▶</span>কোর্স দেখো</a>
        </div>
        <div id="heroStats" style="opacity:0;margin-top:30px;position:relative;width:540px;max-width:46vw;height:150px;will-change:opacity;">
          <div id="statRowA" style="position:absolute;left:0;top:0;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:8px;border-radius:22px;background:rgba(0,0,0,0.35);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 18px 44px rgba(8,16,45,.30);will-change:transform,opacity;">
            <div class="hstat" data-d="৩০" data-suf="লক্ষ+" data-label="শিক্ষার্থী" data-icon="/assets/stat-students.svg"></div>
            <div class="hstat" data-d="২০" data-suf="জন+" data-label="অভিজ্ঞ মেন্টর" data-icon="/assets/stat-mentor.svg"></div>
          </div>
          <div id="statRowB" style="position:absolute;left:0;top:0;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:8px;border-radius:22px;background:rgba(0,0,0,0.35);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 18px 44px rgba(8,16,45,.30);opacity:0;will-change:transform,opacity;">
            <div class="hstat" data-d="৪৫" data-suf="লক্ষ+" data-label="অ্যাপ ডাউনলোড" data-icon="/assets/stat-downloads.svg"></div>
            <div class="hstat" data-d="৫" data-suf="লক্ষ+" data-label="লার্নিং ম্যাটেরিয়াল" data-icon="/assets/stat-materials.svg"></div>
          </div>
        </div>
        </div>
        <div id="scrollHint" style="margin-top:30px;display:inline-flex;align-items:center;gap:9px;font-family:'Hind Siliguri',sans-serif;font-size:14px;font-weight:500;color:#C3CCE6;">
          <span style="display:inline-flex;width:26px;height:26px;border-radius:50%;border:1.5px solid rgba(255,255,255,.45);align-items:center;justify-content:center;">↓</span>
          স্ক্রল করো
        </div>
      </div>

      <!-- progress rail -->
      <div id="rail" style="position:absolute;left:32px;top:50%;transform:translateY(-50%);height:340px;z-index:35;opacity:0;will-change:opacity;">
        <div style="position:absolute;left:13px;top:0;bottom:0;width:2px;background:linear-gradient(180deg,rgba(45,71,151,.12),rgba(45,71,151,.12));"></div>
        <div id="railFill" style="position:absolute;left:13px;top:0;width:2px;height:0%;background:var(--accent);"></div>
        <div id="railTicks" style="position:relative;height:100%;">
          <div class="rtick" style="position:absolute;top:0%;left:0;display:flex;align-items:center;gap:14px;"><span class="rdot" style="width:10px;height:10px;border-radius:50%;background:#fff;border:2px solid rgba(45,71,151,.3);margin-left:9px;"></span><span class="rlab" style="font-family:'Plus Jakarta Sans';font-size:12px;font-weight:700;color:#9aa2bd;letter-spacing:.05em;">01</span></div>
          <div class="rtick" style="position:absolute;top:20%;left:0;display:flex;align-items:center;gap:14px;"><span class="rdot" style="width:10px;height:10px;border-radius:50%;background:#fff;border:2px solid rgba(45,71,151,.3);margin-left:9px;"></span><span class="rlab" style="font-family:'Plus Jakarta Sans';font-size:12px;font-weight:700;color:#9aa2bd;letter-spacing:.05em;">02</span></div>
          <div class="rtick" style="position:absolute;top:40%;left:0;display:flex;align-items:center;gap:14px;"><span class="rdot" style="width:10px;height:10px;border-radius:50%;background:#fff;border:2px solid rgba(45,71,151,.3);margin-left:9px;"></span><span class="rlab" style="font-family:'Plus Jakarta Sans';font-size:12px;font-weight:700;color:#9aa2bd;letter-spacing:.05em;">03</span></div>
          <div class="rtick" style="position:absolute;top:60%;left:0;display:flex;align-items:center;gap:14px;"><span class="rdot" style="width:10px;height:10px;border-radius:50%;background:#fff;border:2px solid rgba(45,71,151,.3);margin-left:9px;"></span><span class="rlab" style="font-family:'Plus Jakarta Sans';font-size:12px;font-weight:700;color:#9aa2bd;letter-spacing:.05em;">04</span></div>
          <div class="rtick" style="position:absolute;top:80%;left:0;display:flex;align-items:center;gap:14px;"><span class="rdot" style="width:10px;height:10px;border-radius:50%;background:#fff;border:2px solid rgba(45,71,151,.3);margin-left:9px;"></span><span class="rlab" style="font-family:'Plus Jakarta Sans';font-size:12px;font-weight:700;color:#9aa2bd;letter-spacing:.05em;">05</span></div>
          <div class="rtick" style="position:absolute;top:100%;left:0;display:flex;align-items:center;gap:14px;"><span class="rdot" style="width:10px;height:10px;border-radius:50%;background:#fff;border:2px solid rgba(45,71,151,.3);margin-left:9px;"></span><span class="rlab" style="font-family:'Plus Jakarta Sans';font-size:12px;font-weight:700;color:#9aa2bd;letter-spacing:.05em;">06</span></div>
          <img id="railBird" src="/assets/shikho-bird.svg" style="position:absolute;left:-12px;top:0%;width:42px;height:auto;transform:translateY(-50%);transition:none;filter:drop-shadow(0 4px 8px rgba(226,0,141,.3));">
        </div>
      </div>

      <!-- side beat texts -->
      <div id="beats" style="position:absolute;left:10%;top:60%;transform:translateY(-50%);width:min(34%,440px);z-index:30;">
        <div class="beat" id="beat-1" style="position:absolute;left:0;top:50%;transform:translateY(-50%);width:100%;opacity:0;will-change:opacity,transform;">
          <div style="display:flex;align-items:center;gap:9px;font-family:'Hind Siliguri',sans-serif;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#2D4797;margin-bottom:16px;"><span style="width:7px;height:7px;border-radius:50%;background:var(--accent);"></span>Smart Class AI</div>
          <h2 style="font-family:'Anek Bangla',sans-serif;font-weight:700;font-size:clamp(30px,3.2vw,46px);line-height:1.08;margin:0;letter-spacing:-.01em;">ভিডিও দেখো,<br>AI দিয়ে বুঝে নাও।</h2>
          <p style="font-family:'Hind Siliguri',sans-serif;font-size:18px;line-height:1.6;color:#4A5270;margin:18px 0 0;">প্রতিটা সেগমেন্টের জন্য আলাদা ব্যাখ্যা, প্র্যাকটিস, আর গাইডেন্স — ঠিক যেখানে আটকে গেছো, সেখানেই।</p>
        </div>
        <div class="beat" id="beat-2" style="position:absolute;left:0;top:50%;transform:translateY(-50%);width:100%;opacity:0;will-change:opacity,transform;">
          <div style="display:flex;align-items:center;gap:9px;font-family:'Hind Siliguri',sans-serif;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#2D4797;margin-bottom:16px;"><span style="width:7px;height:7px;border-radius:50%;background:var(--accent);"></span>Shikho AI</div>
          <h2 style="font-family:'Anek Bangla',sans-serif;font-weight:700;font-size:clamp(30px,3.2vw,46px);line-height:1.08;margin:0;letter-spacing:-.01em;">যেকোনো প্রশ্ন,<br>তাৎক্ষণিক উত্তর।</h2>
          <p style="font-family:'Hind Siliguri',sans-serif;font-size:18px;line-height:1.6;color:#4A5270;margin:18px 0 0;">টাইপ করো বা ছবি তুলো — Shikho AI বুঝে নেবে, উত্তর দেবে সাথে সাথেই।</p>
        </div>
        <div class="beat" id="beat-3" style="position:absolute;left:0;top:50%;transform:translateY(-50%);width:100%;opacity:0;will-change:opacity,transform;">
          <div style="display:flex;align-items:center;gap:9px;font-family:'Hind Siliguri',sans-serif;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#2D4797;margin-bottom:16px;"><span style="width:7px;height:7px;border-radius:50%;background:var(--accent);"></span>রিপোর্ট কার্ড</div>
          <h2 style="font-family:'Anek Bangla',sans-serif;font-weight:700;font-size:clamp(30px,3.2vw,46px);line-height:1.08;margin:0;letter-spacing:-.01em;">কী পড়তে হবে,<br>রিপোর্ট কার্ডই বলে দেবে।</h2>
          <p style="font-family:'Hind Siliguri',sans-serif;font-size:18px;line-height:1.6;color:#4A5270;margin:18px 0 0;">তোমার পারফরম্যান্স অনুযায়ী সাজানো প্রায়োরিটি — প্রতিদিন কী আগে পড়বে, ঠিক করে দেয়।</p>
        </div>
        <div class="beat" id="beat-4" style="position:absolute;left:0;top:50%;transform:translateY(-50%);width:100%;opacity:0;will-change:opacity,transform;">
          <div style="display:flex;align-items:center;gap:9px;font-family:'Hind Siliguri',sans-serif;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#2D4797;margin-bottom:16px;"><span style="width:7px;height:7px;border-radius:50%;background:var(--accent);"></span>কোর্স প্রোগ্রেস</div>
          <h2 style="font-family:'Anek Bangla',sans-serif;font-weight:700;font-size:clamp(30px,3.2vw,46px);line-height:1.08;margin:0;letter-spacing:-.01em;">ধাপে ধাপে এগিয়ে যাও,<br>পরিকল্পনামাফিক।</h2>
          <p style="font-family:'Hind Siliguri',sans-serif;font-size:18px;line-height:1.6;color:#4A5270;margin:18px 0 0;">প্রতিটা কোয়ার্টার শেষ করো, পরেরটা আনলক হবে নিজে থেকেই।</p>
        </div>
        <div class="beat" id="beat-5" style="position:absolute;left:0;top:50%;transform:translateY(-50%);width:100%;opacity:0;will-change:opacity,transform;">
          <div style="display:flex;align-items:center;gap:9px;font-family:'Hind Siliguri',sans-serif;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#2D4797;margin-bottom:16px;"><span style="width:7px;height:7px;border-radius:50%;background:var(--accent);"></span>প্র্যাকটিস MCQ</div>
          <h2 style="font-family:'Anek Bangla',sans-serif;font-weight:700;font-size:clamp(30px,3.2vw,46px);line-height:1.08;margin:0;letter-spacing:-.01em;">নিজেকে যাচাই করো,<br>যেকোনো সময়।</h2>
          <p style="font-family:'Hind Siliguri',sans-serif;font-size:18px;line-height:1.6;color:#4A5270;margin:18px 0 0;">নিজের মতো কুইজ বানাও, সাথে সাথে ফলাফল আর ধাপে ধাপে ব্যাখ্যা পাও।</p>
        </div>
        <div class="beat" id="beat-6" style="position:absolute;left:0;top:50%;transform:translateY(-50%);width:100%;opacity:0;will-change:opacity,transform;">
          <div style="display:flex;align-items:center;gap:9px;font-family:'Hind Siliguri',sans-serif;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#2D4797;margin-bottom:16px;"><span style="width:7px;height:7px;border-radius:50%;background:var(--accent);"></span>লিডারবোর্ড</div>
          <h2 style="font-family:'Anek Bangla',sans-serif;font-weight:700;font-size:clamp(30px,3.2vw,46px);line-height:1.08;margin:0;letter-spacing:-.01em;">নিজের জায়গা জানো,<br>এগিয়ে যাওয়ার অনুপ্রেরণা পাও।</h2>
          <p style="font-family:'Hind Siliguri',sans-serif;font-size:18px;line-height:1.6;color:#4A5270;margin:18px 0 0;">সারাদেশের শিক্ষার্থীদের মাঝে তোমার র‍্যাংক — সাবজেক্ট অনুযায়ী।</p>
        </div>
      </div>

      <!-- STUDENT holding the phone (behind it) -->
      <div id="student" style="position:absolute;left:84%;bottom:0;transform:translateX(-50%);height:96vh;z-index:24;will-change:transform,opacity;transform-origin:50% 100%;pointer-events:none;">
        <img src="/assets/student.png" alt="" style="display:block;height:100%;width:auto;filter:drop-shadow(0 26px 54px rgba(13,26,91,.20));">
      </div>

      <!-- PHONE -->
      <div id="phone" style="position:absolute;transform:translate(-50%,-50%) scale(1);width:300px;height:610px;z-index:25;will-change:transform;display:flex;top:500px;left:700px;">
        <div style="position:absolute;inset:0;border-radius:46px;box-shadow:0px 40px 80px -20px #0d1a5b73;padding:9px;background-color:#d7daea;">
          <div id="viewport" style="position:relative;width:100%;height:100%;border-radius:38px;overflow:hidden;background:#F4F6FB;">
            <div id="statusBar" style="position:absolute;top:0;left:0;right:0;height:34px;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:0 22px;font-family:'Plus Jakarta Sans';font-size:12px;font-weight:700;color:#161B33;pointer-events:none;transition:opacity .3s ease;">
              <span>৯:৪১</span>
              <span style="display:flex;gap:5px;align-items:center;font-size:10px;">▮▮▮ ◗ ▮</span>
            </div>

            <!-- SCREEN 0 : HOME — real app screen with collapsing-header scroll
                 (built at Figma's native 412px width, scaled to the phone viewport).
                 Layers: heroBg(z1) < heroExpand greeting/focushub(z2) < content(z3)
                 < compact sticky header(z4) < bottom nav(z5). -->
            <div class="screen" id="screen-0" style="position:absolute;inset:0;overflow:hidden;background:#0a1230;opacity:1;">
              <div id="homeApp" style="position:absolute;top:0;left:0;width:412px;height:865px;transform:scale(0.684466);transform-origin:top left;font-family:'Baloo Da 2','Hind Siliguri',sans-serif;color:#0A0A0A;">

                <!-- collapsing blue hero background -->
                <div id="homeHeroBg" style="position:absolute;top:0;left:0;width:100%;height:375px;background:linear-gradient(to top,#1432ab 14%,#081445);z-index:1;will-change:height;"></div>

                <!-- expandable hero content (greeting + focus hub) — content scrolls over it -->
                <div id="heroExpand" style="position:absolute;top:0;left:0;width:412px;z-index:2;will-change:transform,opacity;">
                  <div style="position:absolute;top:114px;left:20px;width:372px;display:flex;align-items:flex-start;justify-content:space-between;">
                    <div style="display:flex;flex-direction:column;gap:6px;width:292px;">
                      <div style="align-self:flex-start;background:#f3be28;border-radius:20px;padding:2px 10px;display:flex;align-items:center;gap:5px;"><span style="font-size:11px;">👑</span><span style="font-size:12px;font-weight:500;color:#0a0a0a;">প্রিমিয়াম</span></div>
                      <div style="display:flex;align-items:center;gap:8px;font-size:20px;font-weight:600;color:#fff;">হ্যালো, আরিয়ান <span>👋</span></div>
                      <div style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:rgba(255,255,255,.88);"><span style="white-space:nowrap;">ক্লাস ৯ - এসএসসি'২৭</span><span style="width:3px;height:3px;border-radius:50%;background:rgba(255,255,255,.6);flex:none;"></span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">ঢাকা রেসিডেন্সিয়াল মডেল স্কুল & কলেজ...</span></div>
                    </div>
                    <div style="position:relative;width:60px;height:60px;border:2px solid #f3be28;border-radius:50%;flex:none;">
                      <div style="position:absolute;inset:2px;border-radius:50%;background:linear-gradient(135deg,#FAA700,#E2008D);"></div>
                      <div style="position:absolute;left:40px;top:-5px;width:19px;height:19px;background:#303ebf;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;">👑</div>
                      <div style="position:absolute;bottom:-12px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.5);backdrop-filter:blur(6px);border-radius:34px;padding:2px 8px;display:flex;align-items:center;gap:3px;white-space:nowrap;"><span style="font-size:10px;">🔥</span><span style="font-size:12px;font-weight:600;color:#fff;">১৫৫</span></div>
                    </div>
                  </div>
                  <div style="position:absolute;top:209px;left:20px;width:372px;border:1.5px solid #fff;border-radius:16px;padding:12px 16px;box-shadow:0 4px 6px rgba(0,0,0,.1);background:linear-gradient(50deg,#fff 34%,#5468ff 94%);display:flex;align-items:center;justify-content:space-between;">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <div style="width:41px;height:41px;border-radius:50%;background:#E8ECFF;display:flex;align-items:center;justify-content:center;font-size:20px;flex:none;">👤</div>
                      <div style="display:flex;flex-direction:column;">
                        <span style="font-size:14px;font-weight:600;color:#0a0a0a;">প্রোফাইল ছবি যোগ করো</span>
                        <span style="font-size:12px;font-weight:500;color:#404040;">বন্ধুরা আর শিক্ষকরা তোমাকে সহজে চিনবে</span>
                      </div>
                    </div>
                    <div style="width:24px;height:24px;background:#fff;border-radius:4px;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(0,0,0,.12);color:#0a0a0a;font-size:14px;flex:none;">→</div>
                  </div>
                </div>

                <!-- scrolling content (overlaps the focus hub) -->
                <div id="homeContent" style="position:absolute;top:92px;left:0;width:412px;height:695px;overflow:hidden;z-index:3;">
                  <div id="homeContentInner" style="position:absolute;top:0;left:0;width:412px;padding-top:202px;will-change:transform;">
                    <div style="background:#F4F6FB;border-radius:0;padding:18px 0 24px;">

                      <!-- রুটিন -->
                      <div style="padding:0 20px;display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;"><span style="font-size:20px;font-weight:700;">রুটিন</span><span style="font-size:13px;font-weight:600;color:#2D4797;background:#fff;border:1px solid #E7EBF4;border-radius:99px;padding:4px 12px;">সব দেখো</span></div>
                      <div style="padding:0 16px;display:grid;grid-template-columns:repeat(7,1fr);margin-bottom:8px;">
                        <div class="rday" data-d="শনি" data-n="০৫"></div>
                        <div class="rday rday-on" data-d="রবি" data-n="০৬"></div>
                        <div class="rday" data-d="সোম" data-n="০৭"></div>
                        <div class="rday" data-d="মঙ্গল" data-n="০৮"></div>
                        <div class="rday" data-d="বুধ" data-n="০৯"></div>
                        <div class="rday" data-d="বৃহ." data-n="১০"></div>
                        <div class="rday" data-d="শুক্র." data-n="১১"></div>
                      </div>
                      <div style="padding:0 20px;display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;"><span style="font-size:12px;color:#6E7691;">রবিবার, ০৬/০৮/২৬</span><span style="display:flex;gap:12px;font-size:11px;color:#6E7691;"><span style="display:flex;align-items:center;gap:5px;"><span style="width:8px;height:8px;border-radius:2px;background:#30C4D8;"></span>ক্লাস: ০২</span><span style="display:flex;align-items:center;gap:5px;"><span style="width:8px;height:8px;border-radius:2px;background:#FAA700;"></span>এক্সাম: ০১</span></span></div>

                      <!-- routine cards (horizontal) -->
                      <div style="display:flex;gap:10px;padding:0 20px 18px;overflow:hidden;">
                        <div style="flex:none;width:300px;background:linear-gradient(120deg,#FFEDE3,#FFF7F2);border:1px solid #FFE0CE;border-radius:16px;padding:14px;">
                          <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;"><span style="font-size:11px;font-weight:600;color:#fff;background:#FF7B33;border-radius:99px;padding:3px 9px;">সাধারণ গণিত</span><span style="font-size:11px;font-weight:600;color:#404040;background:#fff;border-radius:99px;padding:3px 9px;">📋 লেকচার ক্লাস</span><span style="width:7px;height:7px;border-radius:50%;background:#FF1C5A;"></span></div>
                          <div style="font-size:15px;font-weight:600;margin-bottom:8px;">রেখা , কোণ ও ত্রিভুজ পর্ব-৩</div>
                          <div style="font-size:12px;font-weight:600;color:#FF7B33;">11:00 AM - 12:15 PM · ১ ঘণ্টা ১৫ মিনিট</div>
                        </div>
                        <div style="flex:none;width:300px;background:linear-gradient(120deg,#E2F7FB,#F2FCFE);border:1px solid #CDEEF4;border-radius:16px;padding:14px;">
                          <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;"><span style="font-size:11px;font-weight:600;color:#fff;background:#30C4D8;border-radius:99px;padding:3px 9px;">রসায়ন</span><span style="font-size:11px;font-weight:600;color:#404040;background:#fff;border-radius:99px;padding:3px 9px;">এক্সাম</span></div>
                          <div style="font-size:15px;font-weight:600;margin-bottom:8px;">পদার্থের অবস্থা ও চাপ</div>
                          <div style="font-size:12px;font-weight:600;color:#1AA3B8;">8:30 PM - 9:30 PM · ১ ঘণ্টা</div>
                        </div>
                      </div>

                      <div style="height:1px;background:#E7EBF4;margin:0 0 18px;"></div>

                      <!-- তোমার প্রায়োরিটি বিষয় -->
                      <div style="padding:0 20px;display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;"><span style="font-size:20px;font-weight:700;">তোমার প্রায়োরিটি বিষয়</span><span style="font-size:13px;font-weight:600;color:#2D4797;background:#fff;border:1px solid #E7EBF4;border-radius:99px;padding:4px 12px;white-space:nowrap;">⇅ সাজাও</span></div>
                      <div style="padding:0 20px;display:flex;flex-direction:column;gap:14px;">
                        <div class="psub" data-icon="🧮" data-sub="সাধারণ গণিত" data-title="রেখা , কোণ ও ত্রিভুজ পর্ব-৩" data-meta="ক্লাস: ২/৩ · এক্সাম: ০৮ মার্চ, ১১:৩০ AM" data-pct="30" data-color="#FF7B33"></div>
                        <div class="psub" data-icon="📕" data-sub="বাংলা" data-title="প্রবাস বন্ধু + আমি কোনো আগন্তুক নই" data-meta="ক্লাস: ৩/৩ · এক্সাম: ১০ মার্চ, ১০:০০ AM" data-pct="90" data-color="#E74D4F"></div>
                        <div class="psub" data-icon="📘" data-sub="ইংরেজি" data-title="Reading Part Class - 2" data-meta="ক্লাস: ৩/৩ · এক্সাম: ০৮ মার্চ, ১১:০০ AM" data-pct="50" data-color="#30C4D8"></div>
                        <div class="psub" data-icon="🌿" data-sub="সাধারণ বিজ্ঞান" data-title="পর্ব-৯: জীবজগৎ" data-meta="ক্লাস: ১/৩ · এক্সাম: ০৮ মার্চ, ১১:০০ AM" data-pct="60" data-color="#5F9573"></div>
                      </div>
                      <div style="display:flex;justify-content:center;margin:16px 0 4px;"><span style="font-size:14px;font-weight:600;color:#2D4797;">আরও ৩টি দেখো ⌄</span></div>

                      <div style="height:1px;background:#E7EBF4;margin:14px 0 18px;"></div>

                      <!-- কোর্স প্রোগ্রেস -->
                      <div style="padding:0 20px;font-size:20px;font-weight:700;margin-bottom:16px;">কোর্স প্রোগ্রেস</div>
                      <div style="padding:0 20px;display:flex;gap:14px;">
                        <div style="display:flex;flex-direction:column;align-items:center;padding-top:6px;">
                          <div style="width:30px;height:30px;border-radius:50%;background:#1F9D55;color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px;">✓</div>
                          <div style="width:2px;flex:1;background:#E2E6F0;min-height:42px;"></div>
                          <div style="width:30px;height:30px;border-radius:50%;background:#2D4797;border:3px solid #C9D3F0;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">২</div>
                          <div style="width:2px;flex:1;background:#E2E6F0;min-height:42px;"></div>
                          <div style="width:30px;height:30px;border-radius:50%;background:#D6DCEA;color:#6E7691;display:flex;align-items:center;justify-content:center;font-size:13px;">🔒</div>
                          <div style="width:2px;flex:1;background:#E2E6F0;min-height:42px;"></div>
                          <div style="width:30px;height:30px;border-radius:50%;background:#FAD7D7;color:#C0392B;display:flex;align-items:center;justify-content:center;font-size:13px;">🔒</div>
                        </div>
                        <div style="flex:1;display:flex;flex-direction:column;gap:14px;">
                          <div class="qpill" style="position:relative;height:64px;border-radius:14px;overflow:hidden;background:#E9EBF0;display:flex;align-items:center;padding:0 14px;">
                            <div class="qpfill" data-pct="100" style="position:absolute;inset:0;width:0%;background:repeating-linear-gradient(115deg,#22C55E,#22C55E 9px,#1FB350 9px,#1FB350 18px);"></div>
                            <div style="position:relative;display:flex;flex-direction:column;gap:4px;color:#fff;"><div style="display:flex;align-items:center;gap:8px;"><span style="font-size:14px;font-weight:700;">কোয়ার্টার ১</span><span style="font-size:10px;font-weight:600;background:rgba(255,255,255,.25);border-radius:99px;padding:2px 8px;">পড়ানো শেষ</span></div><span style="font-size:16px;font-weight:800;">১০০%</span></div>
                            <div style="position:relative;margin-left:auto;width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center;color:#1F9D55;font-size:14px;">›</div>
                          </div>
                          <div class="qpill" style="position:relative;height:64px;border-radius:14px;overflow:hidden;background:#1c1c1c;display:flex;align-items:center;padding:0 14px;">
                            <div class="qpfill" data-pct="80" style="position:absolute;left:0;top:0;bottom:0;width:0%;background:repeating-linear-gradient(115deg,#5468FF,#5468FF 9px,#4757E0 9px,#4757E0 18px);"></div>
                            <div style="position:relative;display:flex;flex-direction:column;gap:4px;color:#fff;"><div style="display:flex;align-items:center;gap:8px;"><span style="font-size:14px;font-weight:700;">কোয়ার্টার ২</span><span style="font-size:10px;font-weight:600;background:#D5E7FF;color:#2D4797;border-radius:99px;padding:2px 8px;">চলমান</span></div><span style="font-size:16px;font-weight:800;">৮০%</span></div>
                            <div style="position:relative;margin-left:auto;width:26px;height:26px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;color:#1c1c1c;font-size:14px;">›</div>
                          </div>
                          <div class="qpill" style="position:relative;height:64px;border-radius:14px;background:#EFEFEF;display:flex;align-items:center;padding:0 14px;">
                            <div style="display:flex;flex-direction:column;gap:4px;"><div style="display:flex;align-items:center;gap:8px;"><span style="font-size:14px;font-weight:700;">কোয়ার্টার ৩</span><span style="font-size:10px;font-weight:600;background:#DEF7EA;color:#1F9D55;border-radius:99px;padding:2px 8px;">কঠিন হবে?</span></div><span style="font-size:11px;color:#6E7691;">জুলাই ১০ - সেপ্টেম্বর ১০</span></div>
                            <div style="margin-left:auto;width:26px;height:26px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;color:#9aa2bd;font-size:14px;">›</div>
                          </div>
                          <div class="qpill" style="position:relative;height:64px;border-radius:14px;background:#FEE2E2;display:flex;align-items:center;padding:0 14px;">
                            <div style="display:flex;flex-direction:column;gap:4px;"><div style="display:flex;align-items:center;gap:8px;"><span style="font-size:14px;font-weight:700;">কোয়ার্টার ৪</span><span style="font-size:10px;font-weight:600;background:#FFD9D9;color:#C0392B;border-radius:99px;padding:2px 8px;">কঠিন হবে?</span></div><span style="font-size:11px;color:#6E7691;">সেপ্টেম্বর ১০ - নভেম্বর ১০</span></div>
                            <div style="margin-left:auto;width:26px;height:26px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;color:#9aa2bd;font-size:14px;">›</div>
                          </div>
                        </div>
                      </div>

                      <!-- FutureBook banner -->
                      <div style="margin:18px 20px 0;border:1px solid #E7EBF4;border-radius:16px;background:#fff;padding:14px;display:flex;align-items:center;gap:12px;">
                        <div style="flex:1;"><div style="font-size:14px;font-weight:700;margin-bottom:4px;">FutureBook স্ক্যান করো</div><div style="font-size:11px;color:#6E7691;line-height:1.5;">তোমার FutureBook-এর FutureLink স্ক্যান করে ভিডিও দেখা ও টিউশনের অগ্রগতি ট্র্যাক করো।</div><div style="margin-top:8px;font-size:11px;font-weight:600;color:#fff;background:#5468FF;border-radius:99px;padding:5px 12px;display:inline-block;">স্ক্যান করো ›</div></div>
                        <div style="width:56px;height:56px;border-radius:10px;background:#161B33;display:flex;align-items:center;justify-content:center;font-size:26px;flex:none;">▦</div>
                      </div>

                      <div style="height:1px;background:#E7EBF4;margin:18px 0;"></div>

                      <!-- ফিচারস -->
                      <div style="padding:0 20px;font-size:20px;font-weight:700;margin-bottom:16px;">ফিচারস</div>
                      <div style="padding:0 20px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                        <div style="height:150px;border-radius:18px;padding:16px;background:linear-gradient(160deg,#2B3A8C,#16224A);color:#fff;display:flex;flex-direction:column;justify-content:space-between;"><div style="font-size:30px;font-weight:800;">৯০%</div><div style="font-size:14px;font-weight:600;">রিপোর্ট কার্ড দেখো ›</div></div>
                        <div style="height:150px;border-radius:18px;padding:16px;background:linear-gradient(160deg,#3550C4,#22337A);color:#fff;display:flex;flex-direction:column;justify-content:flex-end;gap:6px;"><div style="font-size:26px;">🧠</div><div style="font-size:14px;font-weight:700;">প্র্যাকটিস কুইজ</div><div style="font-size:11px;opacity:.8;line-height:1.4;">বিষয়, অধ্যায় ও টপিক নিজে সিলেক্ট করে কুইজ প্র্যাকটিস করো</div></div>
                        <div style="height:150px;border-radius:18px;padding:16px;background:linear-gradient(160deg,#3550C4,#22337A);color:#fff;display:flex;flex-direction:column;justify-content:flex-end;gap:6px;"><div style="font-size:22px;font-weight:800;">E=mc²</div><div style="font-size:14px;font-weight:700;">অ্যানিমেটেড লেসনস</div><div style="font-size:11px;opacity:.8;line-height:1.4;">সব অধ্যায়ের অ্যানিমেটেড ভিডিও পুল করে দেখো</div></div>
                        <div style="height:150px;border-radius:18px;padding:16px;background:linear-gradient(160deg,#E2008D,#7A1A8C);color:#fff;display:flex;flex-direction:column;justify-content:space-between;"><div style="display:flex;align-items:center;gap:6px;font-size:14px;font-weight:800;"><img src="/assets/shikho-bird-white.svg" alt="" style="height:18px;width:auto;max-width:none;">SHIKHO AI</div><div style="font-size:13px;font-weight:700;background:rgba(255,255,255,.18);border-radius:99px;padding:7px 12px;text-align:center;">ডাউট সলভ করো</div></div>
                      </div>

                    </div>
                  </div>
                </div>

                <!-- compact sticky header (always pinned at top) — opaque so content scrolls cleanly under it -->
                <div id="heroCompact" style="position:absolute;top:0;left:0;width:412px;height:100px;z-index:4;">
                  <div id="heroCompactBg" style="position:absolute;top:0;left:0;width:412px;height:100px;overflow:hidden;z-index:0;"><div style="position:absolute;top:0;left:0;width:412px;height:375px;background:linear-gradient(to top,#1432ab 14%,#081445);"></div></div>
                  <div style="position:relative;z-index:1;height:52px;display:flex;align-items:flex-end;justify-content:space-between;padding:6px 24px 8px;color:#fff;font-size:14px;font-weight:500;"><span>9:30</span><span style="display:flex;gap:6px;align-items:center;font-size:11px;">▮▮▮ ◗ ▮</span></div>
                  <div style="position:absolute;z-index:1;top:62px;left:20px;width:372px;display:flex;align-items:center;justify-content:space-between;">
                    <div style="display:flex;align-items:center;gap:12px;min-width:0;">
                      <img src="/assets/shikho-bird-white.svg" alt="Shikho" style="height:28px;width:auto;max-width:none;flex:none;">
                      <div style="backdrop-filter:blur(6px);background:rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.08);border-radius:34px;padding:5px 10px;display:flex;align-items:center;gap:8px;max-width:178px;"><span style="font-size:13px;font-weight:600;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">ক্লাস ৯ সায়েন্স - SSC '27 বার্ষিক পরীক্ষা প্রস্তুতি</span><span style="color:#fff;font-size:11px;flex:none;">▾</span></div>
                    </div>
                    <div style="display:flex;align-items:center;gap:15px;flex:none;">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path></svg>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.7 21a2 2 0 0 1-3.4 0"></path></svg>
                    </div>
                  </div>
                  <!-- inverse (concave) corners where the header meets the scrolling content -->
                  <div class="invcorner" style="position:absolute;left:0;top:100px;width:18px;height:18px;background:#0c1d65;opacity:0;z-index:2;"><div style="position:absolute;inset:0;background:#F4F6FB;border-top-left-radius:18px;"></div></div>
                  <div class="invcorner" style="position:absolute;right:0;top:100px;width:18px;height:18px;background:#0c1d65;opacity:0;z-index:2;"><div style="position:absolute;inset:0;background:#F4F6FB;border-top-right-radius:18px;"></div></div>
                </div>

                <!-- bottom navigation (pinned) -->
                <div id="homeBottomNav" style="position:absolute;left:0;bottom:0;width:412px;height:78px;z-index:5;background:#fff;border-top:1px solid #EFF1F7;display:flex;justify-content:space-around;align-items:center;padding:10px 8px 16px;box-shadow:0 -6px 18px rgba(22,27,51,.06);">
                  <div style="display:flex;flex-direction:column;align-items:center;gap:5px;width:25%;">
                    <img src="/assets/shikho-bird.svg" alt="" style="width:26px;height:26px;object-fit:contain;max-width:none;">
                    <span style="font-size:12px;font-weight:700;color:#E2008D;">হোম</span>
                  </div>
                  <div style="display:flex;flex-direction:column;align-items:center;gap:5px;width:25%;">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9aa2bd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><polygon points="15.5 8.5 10.5 10.5 8.5 15.5 13.5 13.5"></polygon></svg>
                    <span style="font-size:12px;font-weight:500;color:#9aa2bd;">এক্সপ্লোর</span>
                  </div>
                  <div style="display:flex;flex-direction:column;align-items:center;gap:5px;width:25%;">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9aa2bd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"></path><path d="M4 5.5V20.5"></path></svg>
                    <span style="font-size:12px;font-weight:500;color:#9aa2bd;">কোর্স</span>
                  </div>
                  <div style="display:flex;flex-direction:column;align-items:center;gap:5px;width:25%;">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9aa2bd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 4.6L18.5 9l-4.6 1.9L12 15l-1.9-4.1L5.5 9l4.6-1.4z"></path><path d="M18 16l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"></path></svg>
                    <span style="font-size:12px;font-weight:500;color:#9aa2bd;">শিখো AI</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- SCREEN 1 : SMART CLASS AI -->
            <div class="screen" id="screen-1" style="position:absolute;inset:0;background:#0E1430;padding:34px 0 0;opacity:0;">
              <div style="position:relative;height:148px;margin:0 14px;border-radius:14px;overflow:hidden;background:linear-gradient(135deg,#243a73,#12183a);">
                <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;"><div style="width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.92);display:flex;align-items:center;justify-content:center;color:#2D4797;font-size:16px;">▶</div></div>
                <div style="position:absolute;left:10px;bottom:10px;right:10px;"><div style="height:4px;border-radius:9px;background:rgba(255,255,255,.25);position:relative;"><div style="position:absolute;left:0;top:0;height:100%;width:38%;background:#FAA700;border-radius:9px;"></div><span style="position:absolute;left:24%;top:-2px;width:2px;height:8px;background:#fff;opacity:.7;"></span><span style="position:absolute;left:58%;top:-2px;width:2px;height:8px;background:#fff;opacity:.7;"></span><span style="position:absolute;left:80%;top:-2px;width:2px;height:8px;background:#fff;opacity:.7;"></span></div></div>
              </div>
              <div style="display:flex;gap:8px;padding:12px 14px;overflow:hidden;">
                <div style="flex:none;font-family:'Hind Siliguri';font-size:11px;font-weight:600;color:#fff;background:rgba(226,0,141,.9);padding:6px 11px;border-radius:99px;">মূল বিষয় · ২:১৪</div>
                <div style="flex:none;font-family:'Hind Siliguri';font-size:11px;font-weight:500;color:#c3cae6;background:rgba(255,255,255,.08);padding:6px 11px;border-radius:99px;">উদাহরণ</div>
                <div style="flex:none;font-family:'Hind Siliguri';font-size:11px;font-weight:500;color:#c3cae6;background:rgba(255,255,255,.08);padding:6px 11px;border-radius:99px;">সারাংশ</div>
              </div>
              <div id="s1-aipanel" style="position:absolute;left:0;right:0;bottom:0;height:330px;background:#fff;border-radius:24px 24px 0 0;padding:18px 16px;box-shadow:0 -14px 40px rgba(0,0,0,.18);will-change:transform;">
                <div style="width:38px;height:4px;border-radius:9px;background:#E2E6F0;margin:0 auto 14px;"></div>
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;"><div style="width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,#E2008D,#FAA700);"></div><div style="font-family:'Hind Siliguri';font-size:14px;font-weight:700;">এই সেগমেন্টের AI সহায়তা</div></div>
                <div style="display:flex;gap:6px;margin-bottom:14px;">
                  <div class="s1tab" style="flex:1;text-align:center;font-family:'Hind Siliguri';font-size:12px;font-weight:600;color:#fff;background:#2D4797;padding:9px 0;border-radius:10px;">বুঝিয়ে দাও</div>
                  <div class="s1tab" style="flex:1;text-align:center;font-family:'Hind Siliguri';font-size:12px;font-weight:600;color:#6E7691;background:#F1F4FB;padding:9px 0;border-radius:10px;">অনুশীলন</div>
                  <div class="s1tab" style="flex:1;text-align:center;font-family:'Hind Siliguri';font-size:12px;font-weight:600;color:#6E7691;background:#F1F4FB;padding:9px 0;border-radius:10px;">নির্দেশনা</div>
                </div>
                <div id="s1-body" style="display:flex;flex-direction:column;gap:9px;">
                  <div style="font-family:'Hind Siliguri';font-size:13px;font-weight:700;color:#161B33;">নিউটনের দ্বিতীয় সূত্র</div>
                  <div style="font-family:'Hind Siliguri';font-size:12px;line-height:1.55;color:#4A5270;">বল = ভর × ত্বরণ। কোনো বস্তুর ত্বরণ প্রযুক্ত বলের সমানুপাতিক এবং ভরের ব্যস্তানুপাতিক।</div>
                  <div style="background:#F1F4FB;border-radius:10px;padding:10px;font-family:'Hind Siliguri';font-size:12px;color:#2D4797;font-weight:600;">উদাহরণ: ২ কেজি বস্তুতে ১০ N বল → ত্বরণ ৫ m/s²</div>
                  <div style="display:flex;gap:7px;margin-top:2px;"><span style="font-family:'Hind Siliguri';font-size:11px;color:#6E7691;background:#F1F4FB;padding:6px 10px;border-radius:99px;">সহজ করো</span><span style="font-family:'Hind Siliguri';font-size:11px;color:#6E7691;background:#F1F4FB;padding:6px 10px;border-radius:99px;">আরও উদাহরণ</span></div>
                </div>
              </div>
            </div>

            <!-- SCREEN 2 : SHIKHO AI -->
            <div class="screen" id="screen-2" style="position:absolute;inset:0;background:#F4F6FB;padding:34px 0 0;opacity:0;display:flex;flex-direction:column;">
              <div style="display:flex;align-items:center;gap:9px;padding:8px 16px 14px;border-bottom:1px solid #E7EBF4;">
                <div style="width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,#E2008D,#FAA700);"></div>
                <div style="flex:1;"><div style="font-family:'Hind Siliguri';font-size:14px;font-weight:700;">Shikho AI</div><div style="font-family:'Hind Siliguri';font-size:10px;color:#6E7691;">আজ ৩/১০ প্রশ্ন ব্যবহার হয়েছে</div></div>
              </div>
              <div style="flex:1;padding:16px;display:flex;flex-direction:column;gap:12px;">
                <div style="align-self:flex-end;max-width:78%;background:#2D4797;color:#fff;border-radius:14px 14px 4px 14px;padding:10px 13px;overflow:hidden;"><span id="s2-q" style="font-family:'Hind Siliguri';font-size:13px;display:inline-block;white-space:nowrap;overflow:hidden;">সালোকসংশ্লেষণ কীভাবে কাজ করে?</span></div>
                <div id="s2-think" style="align-self:flex-start;display:flex;gap:5px;padding:10px 14px;background:#fff;border-radius:14px;box-shadow:0 3px 10px rgba(22,27,51,.05);"><span style="width:6px;height:6px;border-radius:50%;background:#B7BFD6;"></span><span style="width:6px;height:6px;border-radius:50%;background:#B7BFD6;"></span><span style="width:6px;height:6px;border-radius:50%;background:#B7BFD6;"></span></div>
                <div id="s2-ans" style="align-self:flex-start;max-width:88%;background:#fff;border-radius:4px 14px 14px 14px;padding:13px;box-shadow:0 4px 14px rgba(22,27,51,.06);display:flex;flex-direction:column;gap:8px;">
                  <div class="s2line" style="font-family:'Hind Siliguri';font-size:13px;font-weight:700;color:#161B33;">সালোকসংশ্লেষণ — সংক্ষেপে</div>
                  <div class="s2line" style="font-family:'Hind Siliguri';font-size:12px;line-height:1.5;color:#4A5270;">১. সূর্যালোক, পানি ও CO₂ গ্রহণ করে উদ্ভিদ।</div>
                  <div class="s2line" style="font-family:'Hind Siliguri';font-size:12px;line-height:1.5;color:#4A5270;">২. ক্লোরোফিল আলোক শক্তি শোষণ করে।</div>
                  <div class="s2line" style="font-family:'Hind Siliguri';font-size:12px;line-height:1.5;color:#4A5270;">৩. গ্লুকোজ তৈরি হয়, অক্সিজেন নির্গত হয়।</div>
                  <div class="s2line" style="font-family:'Hind Siliguri';font-size:11px;color:#2D4797;background:#EEF2FB;border-radius:8px;padding:7px 9px;font-weight:600;">6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</div>
                </div>
              </div>
            </div>

            <!-- SCREEN 3 : REPORT CARD -->
            <div class="screen" id="screen-3" style="position:absolute;inset:0;background:#F4F6FB;padding:42px 16px 16px;opacity:0;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;"><div style="font-family:'Hind Siliguri';font-size:15px;font-weight:700;">রিপোর্ট কার্ড</div><div id="s3-sort" style="font-family:'Hind Siliguri';font-size:11px;font-weight:600;color:#fff;background:var(--accent);padding:6px 12px;border-radius:99px;">সাজাও</div></div>
              <div style="background:#fff;border-radius:16px;padding:16px;display:flex;align-items:center;gap:16px;margin-bottom:14px;box-shadow:0 6px 18px rgba(22,27,51,.06);">
                <div style="position:relative;width:84px;height:84px;flex:none;">
                  <svg width="84" height="84" viewBox="0 0 84 84" style="transform:rotate(-90deg);"><circle cx="42" cy="42" r="34" fill="none" stroke="#EEF1F8" stroke-width="9"></circle><circle id="s3-ring" cx="42" cy="42" r="34" fill="none" stroke="#E2008D" stroke-width="9" stroke-linecap="round" stroke-dasharray="213.6" stroke-dashoffset="21.4"></circle></svg>
                  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;"><div style="font-family:'Plus Jakarta Sans';font-size:22px;font-weight:800;color:#161B33;">৯০%</div><div style="font-family:'Hind Siliguri';font-size:9px;color:#6E7691;">স্কোর</div></div>
                </div>
                <div style="flex:1;"><div style="font-family:'Hind Siliguri';font-size:12px;color:#6E7691;">এই সপ্তাহে</div><div style="font-family:'Hind Siliguri';font-size:14px;font-weight:700;color:#1F9D55;">▲ ৮% উন্নতি</div><div style="font-family:'Hind Siliguri';font-size:11px;color:#6E7691;margin-top:6px;">ক্লাস সম্পন্ন ৭৪% · টপিক ৬৮%</div></div>
              </div>
              <div style="background:#fff;border-radius:16px;padding:6px 14px;box-shadow:0 6px 18px rgba(22,27,51,.06);">
                <div class="s3row" style="display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid #F0F2F8;"><div style="display:flex;align-items:center;gap:9px;"><span class="s3chk" style="width:18px;height:18px;border-radius:6px;border:2px solid #D6DCEA;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;">✓</span><span style="font-family:'Hind Siliguri';font-size:13px;">পদার্থবিজ্ঞান</span></div><span style="font-family:'Plus Jakarta Sans';font-size:12px;font-weight:700;color:#E2008D;background:#FFE4EF;padding:3px 9px;border-radius:99px;">দুর্বল</span></div>
                <div class="s3row" style="display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid #F0F2F8;"><div style="display:flex;align-items:center;gap:9px;"><span class="s3chk" style="width:18px;height:18px;border-radius:6px;border:2px solid #D6DCEA;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;">✓</span><span style="font-family:'Hind Siliguri';font-size:13px;">রসায়ন</span></div><span style="font-family:'Plus Jakarta Sans';font-size:12px;font-weight:700;color:#C98A00;background:#FFF1D6;padding:3px 9px;border-radius:99px;">মাঝারি</span></div>
                <div class="s3row" style="display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid #F0F2F8;"><div style="display:flex;align-items:center;gap:9px;"><span class="s3chk" style="width:18px;height:18px;border-radius:6px;border:2px solid #D6DCEA;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;">✓</span><span style="font-family:'Hind Siliguri';font-size:13px;">উচ্চতর গণিত</span></div><span style="font-family:'Plus Jakarta Sans';font-size:12px;font-weight:700;color:#1F9D55;background:#DEF7EA;padding:3px 9px;border-radius:99px;">ভালো</span></div>
                <div class="s3row" style="display:flex;align-items:center;justify-content:space-between;padding:11px 0;"><div style="display:flex;align-items:center;gap:9px;"><span class="s3chk" style="width:18px;height:18px;border-radius:6px;border:2px solid #D6DCEA;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;">✓</span><span style="font-family:'Hind Siliguri';font-size:13px;">জীববিজ্ঞান</span></div><span style="font-family:'Plus Jakarta Sans';font-size:12px;font-weight:700;color:#1F9D55;background:#DEF7EA;padding:3px 9px;border-radius:99px;">ভালো</span></div>
              </div>
            </div>

            <!-- SCREEN 4 : COURSE PROGRESS -->
            <div class="screen" id="screen-4" style="position:absolute;inset:0;background:#F4F6FB;padding:44px 18px 16px;opacity:0;">
              <div style="font-family:'Hind Siliguri';font-size:15px;font-weight:700;margin-bottom:20px;">কোর্স প্রোগ্রেস</div>
              <div style="position:relative;padding-left:6px;">
                <div style="display:flex;gap:14px;margin-bottom:6px;"><div style="width:26px;height:26px;border-radius:50%;background:#1F9D55;color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;flex:none;">✓</div><div style="flex:1;background:#fff;border-radius:12px;padding:11px 13px;box-shadow:0 3px 10px rgba(22,27,51,.05);"><div style="font-family:'Hind Siliguri';font-size:13px;font-weight:600;">কোয়ার্টার ১</div><div style="font-family:'Hind Siliguri';font-size:11px;color:#1F9D55;">সম্পন্ন</div></div></div>
                <div style="margin-left:12px;height:18px;width:2px;background:#E2E6F0;"></div>
                <div style="display:flex;gap:14px;margin-bottom:6px;"><div style="position:relative;width:26px;height:26px;flex:none;"><div style="width:26px;height:26px;border-radius:50%;background:#2D4797;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-family:'Plus Jakarta Sans';font-weight:700;">২</div><div id="s4-check2" style="position:absolute;inset:0;border-radius:50%;background:#1F9D55;color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;transform:scale(0);">✓</div></div><div style="flex:1;background:#fff;border-radius:12px;padding:11px 13px;box-shadow:0 3px 10px rgba(22,27,51,.05);"><div style="font-family:'Hind Siliguri';font-size:13px;font-weight:600;">কোয়ার্টার ২</div><div style="height:6px;border-radius:99px;background:#EEF1F8;margin-top:7px;"><div id="s4-bar" style="height:100%;width:80%;border-radius:99px;background:#2D4797;"></div></div></div></div>
                <div style="margin-left:12px;height:18px;width:2px;background:#E2E6F0;position:relative;"><div id="s4-line" style="position:absolute;left:0;top:0;width:2px;height:0;background:#1F9D55;"></div></div>
                <div style="display:flex;gap:14px;"><div style="position:relative;width:26px;height:26px;flex:none;"><div id="s4-lock" style="width:26px;height:26px;border-radius:50%;background:#D6DCEA;color:#6E7691;display:flex;align-items:center;justify-content:center;font-size:12px;">🔒</div><div id="s4-unlock" style="position:absolute;inset:0;border-radius:50%;background:#2D4797;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-family:'Plus Jakarta Sans';font-weight:700;opacity:0;transform:scale(.6);">৩</div><div id="s4-glow" style="position:absolute;inset:-6px;border-radius:50%;background:radial-gradient(circle,rgba(250,167,0,.6),transparent 70%);opacity:0;"></div></div><div id="s4-q3card" style="flex:1;background:#fff;border-radius:12px;padding:11px 13px;box-shadow:0 3px 10px rgba(22,27,51,.05);opacity:.6;"><div style="font-family:'Hind Siliguri';font-size:13px;font-weight:600;">কোয়ার্টার ৩</div><div id="s4-q3sub" style="font-family:'Hind Siliguri';font-size:11px;color:#6E7691;">লকড</div></div></div>
              </div>
            </div>

            <!-- SCREEN 5 : PRACTICE MCQ -->
            <div class="screen" id="screen-5" style="position:absolute;inset:0;background:#F4F6FB;padding:42px 16px 16px;opacity:0;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;"><div style="font-family:'Hind Siliguri';font-size:12px;color:#6E7691;">প্রশ্ন ৩ / ১০</div><div style="font-family:'Plus Jakarta Sans';font-size:12px;font-weight:700;color:#E2008D;background:#FFE4EF;padding:5px 11px;border-radius:99px;">⏱ ০:৪২</div></div>
              <div style="background:#fff;border-radius:16px;padding:16px;box-shadow:0 6px 18px rgba(22,27,51,.06);margin-bottom:12px;"><div style="font-family:'Hind Siliguri';font-size:14px;font-weight:600;line-height:1.5;color:#161B33;">পানির স্ফুটনাঙ্ক কত ডিগ্রি সেলসিয়াস (সমুদ্রপৃষ্ঠে)?</div></div>
              <div style="display:flex;flex-direction:column;gap:9px;">
                <div class="s5opt" data-r="0" style="background:#fff;border:2px solid #EAEDF5;border-radius:12px;padding:12px 14px;font-family:'Hind Siliguri';font-size:13px;display:flex;align-items:center;gap:10px;"><span class="s5badge" style="width:20px;height:20px;border-radius:50%;border:1.5px solid #C9D0E2;font-family:'Plus Jakarta Sans';font-size:11px;display:flex;align-items:center;justify-content:center;color:#6E7691;">ক</span> ৯০°</div>
                <div class="s5opt" data-r="1" style="background:#fff;border:2px solid #EAEDF5;border-radius:12px;padding:12px 14px;font-family:'Hind Siliguri';font-size:13px;display:flex;align-items:center;gap:10px;"><span class="s5badge" style="width:20px;height:20px;border-radius:50%;border:1.5px solid #C9D0E2;font-family:'Plus Jakarta Sans';font-size:11px;display:flex;align-items:center;justify-content:center;color:#6E7691;">খ</span> ১০০°</div>
                <div class="s5opt" data-r="2" style="background:#fff;border:2px solid #EAEDF5;border-radius:12px;padding:12px 14px;font-family:'Hind Siliguri';font-size:13px;display:flex;align-items:center;gap:10px;"><span class="s5badge" style="width:20px;height:20px;border-radius:50%;border:1.5px solid #C9D0E2;font-family:'Plus Jakarta Sans';font-size:11px;display:flex;align-items:center;justify-content:center;color:#6E7691;">গ</span> ১২০°</div>
              </div>
              <div id="s5-explain" style="margin-top:12px;background:#EEF2FB;border-radius:12px;overflow:hidden;max-height:0;opacity:0;"><div style="padding:12px 14px;"><div style="font-family:'Hind Siliguri';font-size:12px;font-weight:700;color:#2D4797;margin-bottom:4px;">কেন ১০০°?</div><div style="font-family:'Hind Siliguri';font-size:11px;line-height:1.55;color:#4A5270;">সমুদ্রপৃষ্ঠে স্বাভাবিক বায়ুচাপে (১ atm) বিশুদ্ধ পানি ১০০°C তাপমাত্রায় ফোটে।</div></div></div>
            </div>

            <!-- SCREEN 6 : LEADERBOARD -->
            <div class="screen" id="screen-6" style="position:absolute;inset:0;background:linear-gradient(180deg,#2D4797,#1B2B5E 40%,#F4F6FB 40%);padding:42px 14px 0;opacity:0;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;"><div style="font-family:'Hind Siliguri';font-size:14px;font-weight:700;color:#fff;">লিডারবোর্ড</div><div style="font-family:'Hind Siliguri';font-size:11px;font-weight:600;color:#2D4797;background:#fff;padding:5px 11px;border-radius:99px;">পদার্থবিজ্ঞান ▾</div></div>
              <div style="display:flex;align-items:flex-end;justify-content:center;gap:10px;margin-bottom:14px;position:relative;">
                <div id="s6-confetti" style="position:absolute;inset:-10px 0 0;pointer-events:none;"></div>
                <div style="text-align:center;"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#9aa6cf,#cfd6ea);margin:0 auto;border:2px solid #C0C7DE;"></div><div style="font-family:'Plus Jakarta Sans';font-size:11px;font-weight:700;color:#fff;margin-top:3px;">🥈</div><div style="font-family:'Plus Jakarta Sans';font-size:11px;font-weight:700;color:#fff;">৯৪</div></div>
                <div style="text-align:center;"><div style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#FAA700,#FF1C5A);margin:0 auto;border:2px solid #FAA700;"></div><div style="font-size:14px;margin-top:3px;">👑</div><div style="font-family:'Plus Jakarta Sans';font-size:12px;font-weight:800;color:#fff;">৯৮</div></div>
                <div style="text-align:center;"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#d9a36b,#f0c89e);margin:0 auto;border:2px solid #d9a36b;"></div><div style="font-family:'Plus Jakarta Sans';font-size:11px;font-weight:700;color:#fff;margin-top:3px;">🥉</div><div style="font-family:'Plus Jakarta Sans';font-size:11px;font-weight:700;color:#fff;">৯১</div></div>
              </div>
              <div id="s6-list" style="background:#fff;border-radius:16px 16px 0 0;padding:8px 14px 70px;height:100%;box-shadow:0 -6px 20px rgba(0,0,0,.08);">
                <div class="s6r" style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #F0F2F8;"><span style="font-family:'Plus Jakarta Sans';font-size:12px;font-weight:700;color:#6E7691;width:18px;">৪</span><div style="width:26px;height:26px;border-radius:50%;background:#E3E8F4;"></div><span style="flex:1;font-family:'Hind Siliguri';font-size:12px;">সাদিয়া আক্তার</span><span style="font-family:'Plus Jakarta Sans';font-size:12px;font-weight:700;">৮৯</span></div>
                <div class="s6r" style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #F0F2F8;"><span style="font-family:'Plus Jakarta Sans';font-size:12px;font-weight:700;color:#6E7691;width:18px;">৫</span><div style="width:26px;height:26px;border-radius:50%;background:#E3E8F4;"></div><span style="flex:1;font-family:'Hind Siliguri';font-size:12px;">রাকিব হাসান</span><span style="font-family:'Plus Jakarta Sans';font-size:12px;font-weight:700;">৮৬</span></div>
                <div class="s6r" style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #F0F2F8;"><span style="font-family:'Plus Jakarta Sans';font-size:12px;font-weight:700;color:#6E7691;width:18px;">৬</span><div style="width:26px;height:26px;border-radius:50%;background:#E3E8F4;"></div><span style="flex:1;font-family:'Hind Siliguri';font-size:12px;">নুসরাত জাহান</span><span style="font-family:'Plus Jakarta Sans';font-size:12px;font-weight:700;">৮৪</span></div>
              </div>
              <div id="s6-bar" style="position:absolute;left:8px;right:8px;bottom:10px;background:#2D4797;border-radius:14px;padding:11px 14px;display:flex;align-items:center;gap:11px;box-shadow:0 10px 24px rgba(45,71,151,.35);transform:translateY(120%);"><span style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#E2008D,#FAA700);flex:none;"></span><div style="flex:1;color:#fff;"><div style="font-family:'Hind Siliguri';font-size:11px;opacity:.8;">তোমার র‍্যাংক</div><div style="font-family:'Plus Jakarta Sans';font-size:14px;font-weight:800;"><span id="s6-rank">৫৬৯৬</span> <span style="font-size:11px;font-weight:500;opacity:.8;">/ ১,২৪,০০০</span></div></div><span style="font-family:'Hind Siliguri';font-size:11px;font-weight:600;color:#2D4797;background:#fff;padding:6px 11px;border-radius:99px;">শেয়ার</span></div>
            </div>

          </div>
        </div>
      </div>

      <!-- foreground fog -->
      <div id="fogBase" style="position:absolute;left:0;right:0;bottom:0;height:24%;z-index:39;pointer-events:none;will-change:opacity,transform;background:linear-gradient(to top,#F6F5F6 0%,#F6F5F6 14%,rgba(246,245,246,.75) 42%,rgba(246,245,246,0) 100%);"></div>
      <img id="heroFog" src="/assets/fog-static.webp" alt="" style="position:absolute;left:-9%;right:auto;bottom:-14%;width:118%;height:auto;z-index:40;pointer-events:none;will-change:opacity,transform;">

    </div>
  </section>

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

    // ---- math helpers ----
    const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const mc = (v: number, a: number, b: number) => clamp((v - a) / (b - a), 0, 1);
    const eo = (t: number) => 1 - Math.pow(1 - t, 3);
    const eio = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const back = (t: number) => {
      const c1 = 1.70158,
        c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };
    const bn = (n: number | string) =>
      String(n).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);

    const q = <T extends Element = HTMLElement>(s: string) =>
      root.querySelector(s) as T | null;
    const qa = (s: string) => Array.from(root.querySelectorAll(s)) as HTMLElement[];

    // accent (amber, matching the brief)
    const acc = '#FAA700';
    root.style.setProperty('--accent', acc);

    const track = q('#track') as HTMLElement;
    const pace = 9.0; // cinematic
    track.style.height = pace * 100 + 'vh';

    // ---- build data-driven home-screen cells (kept compact in markup) ----
    qa('.rday').forEach((d) => {
      const on = d.classList.contains('rday-on');
      d.innerHTML =
        `<div style="font-size:11px;color:#6E7691;margin-bottom:6px;text-align:center;">${d.getAttribute('data-d')}</div>` +
        `<div style="width:38px;height:58px;margin:0 auto;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:${on ? '#2D4797' : '#fff'};border:1px solid ${on ? '#2D4797' : '#E7EBF4'};">` +
        `<span style="font-size:14px;font-weight:700;color:${on ? '#fff' : '#161B33'};">${d.getAttribute('data-n')}</span>` +
        `<span style="display:flex;gap:2px;"><span style="width:4px;height:4px;border-radius:1px;background:${on ? '#9DB0E8' : '#30C4D8'};"></span><span style="width:4px;height:4px;border-radius:1px;background:${on ? '#9DB0E8' : '#FAA700'};"></span></span></div>`;
    });
    qa('.psub').forEach((c) => {
      const pct = c.getAttribute('data-pct') || '0';
      const color = c.getAttribute('data-color') || '#FF7B33';
      c.setAttribute(
        'style',
        'background:#fff;border:1px solid #EEF0F6;border-radius:16px;padding:14px;box-shadow:0 4px 14px rgba(22,27,51,.04);'
      );
      c.innerHTML =
        `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"><span style="width:26px;height:26px;border-radius:8px;background:#EEF2FB;display:flex;align-items:center;justify-content:center;font-size:14px;">${c.getAttribute('data-icon')}</span><span style="font-size:13px;font-weight:600;color:#404040;">${c.getAttribute('data-sub')}</span></div>` +
        `<div style="font-size:15px;font-weight:600;margin-bottom:6px;">${c.getAttribute('data-title')}</div>` +
        `<div style="font-size:11px;color:#6E7691;margin-bottom:12px;">${c.getAttribute('data-meta')}</div>` +
        `<div style="display:flex;align-items:center;gap:10px;"><div style="flex:1;height:8px;border-radius:99px;background:#EFEFEF;overflow:hidden;"><div class="ppfill" data-pct="${pct}" style="height:100%;width:0%;border-radius:99px;background:${color};"></div></div><span style="font-size:13px;font-weight:700;color:${color};">${bn(pct)}%</span></div>`;
    });

    // build stat cards with odometer digit-reels (Figma stacked-card design)
    const BD = '০১২৩৪৫৬৭৮৯';
    const REELH = 40; // px per digit
    qa('.hstat').forEach((s, si) => {
      const digits = Array.from(s.getAttribute('data-d') || '');
      let reels = '';
      digits.forEach((ch, j) => {
        const target = BD.indexOf(ch);
        const cycles = 1 + j; // a single quick spin (units one more) so it lands fast
        const offset = cycles * 10 + target;
        let col = '';
        for (let k = 0; k <= offset + 1; k++) {
          col += `<span style="display:block;height:${REELH}px;line-height:${REELH}px;">${BD[k % 10]}</span>`;
        }
        reels += `<span style="display:inline-block;height:${REELH}px;overflow:hidden;vertical-align:bottom;"><span class="hreel-col" data-offset="${offset}" data-stat="${si}" style="display:block;transform:translateY(0);will-change:transform;">${col}</span></span>`;
      });
      s.setAttribute(
        'style',
        'position:relative;overflow:hidden;min-width:0;display:flex;align-items:center;gap:10px;padding:14px 12px 14px 18px;border-radius:14px;background:linear-gradient(104deg,rgba(0,0,0,0.20),rgba(44,44,44,0.34));'
      );
      s.innerHTML =
        `<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:8px;">` +
        `<div style="display:flex;align-items:flex-end;font-family:'Anek Bangla','Hind Siliguri',sans-serif;font-weight:800;font-size:${REELH}px;line-height:${REELH}px;color:#fff;letter-spacing:-0.5px;white-space:nowrap;">${reels}<span style="margin-left:7px;font-size:${Math.round(REELH * 0.82)}px;line-height:${REELH}px;">${s.getAttribute('data-suf')}</span></div>` +
        `<div style="font-family:'Hind Siliguri',sans-serif;font-size:15px;font-weight:500;color:#DDDFE4;white-space:nowrap;">${s.getAttribute('data-label')}</div>` +
        `</div>` +
        `<img src="${s.getAttribute('data-icon')}" alt="" style="position:absolute;right:8px;bottom:-16px;width:56px;height:auto;max-width:none;opacity:.9;pointer-events:none;">`;
    });

    const el = {
      heroBg: q<HTMLImageElement>('#heroBg'),
      siteHeader: q('#siteHeader'),
      hdrLogoBox: q('#hdrLogoBox'),
      hdrLogoFull: q<HTMLImageElement>('#hdrLogoFull'),
      hdrLogoBird: q<HTMLImageElement>('#hdrLogoBird'),
      cloudsB: q('#cloudsBack'),
      cloudsF: q('#cloudsFront'),
      glow: q('#glow'),
      hero: q('#heroText'),
      heroBig: q('#heroBig'),
      heroSingle: q('#heroSingle'),
      heroLower: q('#heroLower'),
      heroStats: q('#heroStats'),
      statRowA: q('#statRowA'),
      statRowB: q('#statRowB'),
      hreels: qa('.hreel-col'),
      student: q('#student'),
      hint: q('#scrollHint'),
      phone: q('#phone'),
      fog: q('#heroFog'),
      fogBase: q('#fogBase'),
      landBack: q('#landBack'),
      flowers: q('#flowers'),
      rail: q('#rail'),
      railBird: q('#railBird'),
      railFill: q('#railFill'),
      screens: [0, 1, 2, 3, 4, 5, 6].map((i) => q('#screen-' + i)),
      homeHeroBg: q('#homeHeroBg'),
      heroCompactBg: q('#heroCompactBg'),
      invCorners: qa('.invcorner'),
      heroExpand: q('#heroExpand'),
      homeContent: q('#homeContent'),
      homeContentInner: q('#homeContentInner'),
      ppfills: qa('.ppfill'),
      qpfills: qa('.qpfill'),
      viewport: q('#viewport'),
      statusBar: q('#statusBar'),
      beats: [1, 2, 3, 4, 5, 6].map((i) => q('#beat-' + i)),
      rdots: qa('.rdot'),
      rlabs: qa('.rlab'),
      s1panel: q('#s1-aipanel'),
      s2q: q('#s2-q'),
      s2think: q('#s2-think'),
      s2lines: qa('#s2-ans .s2line'),
      s3ring: q('#s3-ring'),
      s3chk: qa('.s3chk'),
      s4bar: q('#s4-bar'),
      s4check2: q('#s4-check2'),
      s4line: q('#s4-line'),
      s4lock: q('#s4-lock'),
      s4unlock: q('#s4-unlock'),
      s4glow: q('#s4-glow'),
      s4q3card: q('#s4-q3card'),
      s4q3sub: q('#s4-q3sub'),
      s5opts: qa('.s5opt'),
      s5explain: q('#s5-explain'),
      s6list: qa('.s6r'),
      s6bar: q('#s6-bar'),
      s6rank: q('#s6-rank'),
      s6conf: q('#s6-confetti'),
    };

    const s2qWidth = (el.s2q?.scrollWidth as number) || 220;
    let confettiDone = false;
    let phoneScale = 1;

    // header backdrop tone: sections tagged data-dark (1=dark bg, 0=light bg)
    const hdrZones = qa('[data-dark]').map((z) => ({
      el: z,
      d: +(z.getAttribute('data-dark') || 0),
    }));
    let hdrDark = 1; // smoothed darkness behind the header (starts over the dark hero)

    // gap the lower group lifts by once the big title collapses to the single title
    let heroGap = 150;
    const measureHero = () => {
      const bigH = el.heroBig?.offsetHeight || 0;
      const singleH = el.heroSingle?.offsetHeight || 0;
      if (bigH > 0) heroGap = Math.max(0, bigH - singleH);
    };

    const onResize = () => {
      const vh = window.innerHeight;
      phoneScale = clamp(vh / 850, 0.62, 1);
      measureHero();
    };
    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureHero);

    const t0 = performance.now();

    // ---- micro-animations ----
    const anim1 = (sp: number) => {
      if (!el.s1panel) return;
      const y = lerp(100, 0, eo(mc(sp, 0.12, 0.5)));
      el.s1panel.style.transform = `translateY(${y}%)`;
    };
    const anim2 = (sp: number) => {
      if (!el.s2q || !el.s2think) return;
      const tw = mc(sp, 0.08, 0.34);
      el.s2q.style.width = tw * s2qWidth + 'px';
      el.s2think.style.opacity = String(
        clamp(mc(sp, 0.36, 0.42) - mc(sp, 0.5, 0.56), 0, 1)
      );
      el.s2lines.forEach((ln, i) => {
        const start = 0.52 + i * 0.08;
        const a = mc(sp, start, start + 0.1);
        ln.style.opacity = String(a);
        ln.style.transform = `translateY(${lerp(10, 0, eo(a))}px)`;
      });
    };
    const anim3 = (sp: number) => {
      if (!el.s3ring) return;
      const C = 213.6,
        fill = 0.9 * eo(mc(sp, 0.0, 0.42));
      el.s3ring.style.strokeDashoffset = String(C * (1 - fill));
      el.s3chk.forEach((c, i) => {
        const t = mc(sp, 0.46 + i * 0.1, 0.56 + i * 0.1);
        c.style.background = t > 0.5 ? 'var(--accent)' : 'transparent';
        c.style.borderColor = t > 0.5 ? 'var(--accent)' : '#D6DCEA';
        c.style.transform = `scale(${lerp(0.8, 1, t)})`;
        c.style.opacity = t > 0.02 ? '1' : '0.001';
        c.style.color = t > 0.5 ? '#fff' : 'transparent';
      });
    };
    const anim4 = (sp: number) => {
      if (!el.s4bar) return;
      const w = lerp(80, 100, eo(mc(sp, 0.1, 0.42)));
      el.s4bar.style.width = w + '%';
      const ck = mc(sp, 0.42, 0.5);
      el.s4check2!.style.transform = `scale(${clamp(back(ck), 0, 1.15)})`;
      el.s4line!.style.height = lerp(0, 18, mc(sp, 0.46, 0.6)) + 'px';
      const u = mc(sp, 0.6, 0.82);
      el.s4lock!.style.opacity = String(1 - mc(sp, 0.6, 0.7));
      el.s4unlock!.style.opacity = String(mc(sp, 0.62, 0.72));
      el.s4unlock!.style.transform = `scale(${
        u > 0 ? 0.6 + 0.4 * back(clamp(u, 0, 1)) : 0.6
      })`;
      el.s4glow!.style.opacity = String(Math.sin(clamp(u, 0, 1) * Math.PI) * 0.9);
      el.s4q3card!.style.opacity = String(lerp(0.6, 1, u));
      el.s4q3sub!.textContent = u > 0.5 ? 'চালু হয়েছে' : 'লকড';
      el.s4q3sub!.style.color = u > 0.5 ? '#2D4797' : '#6E7691';
    };
    const anim5 = (sp: number) => {
      const picked = sp > 0.42;
      el.s5opts.forEach((o) => {
        const r = o.getAttribute('data-r');
        const badge = o.querySelector('.s5badge') as HTMLElement;
        if (picked && r === '1') {
          o.style.background = '#E7F8EE';
          o.style.borderColor = '#1F9D55';
          badge.style.background = '#1F9D55';
          badge.style.borderColor = '#1F9D55';
          badge.style.color = '#fff';
        } else if (picked && r === '2') {
          o.style.background = '#FDE9EC';
          o.style.borderColor = '#FF1C5A';
          badge.style.background = '#FF1C5A';
          badge.style.borderColor = '#FF1C5A';
          badge.style.color = '#fff';
        } else {
          o.style.background = '#fff';
          o.style.borderColor = '#EAEDF5';
          badge.style.background = 'transparent';
          badge.style.borderColor = '#C9D0E2';
          badge.style.color = '#6E7691';
        }
      });
      if (!el.s5explain) return;
      const ex = mc(sp, 0.55, 0.78);
      el.s5explain.style.maxHeight = lerp(0, 120, ex) + 'px';
      el.s5explain.style.opacity = String(ex);
    };
    const fireConfetti = () => {
      const cont = el.s6conf;
      if (!cont) return;
      const cols = ['#E2008D', '#FAA700', '#FF1C5A', '#355DAB', '#1F9D55'];
      for (let i = 0; i < 18; i++) {
        const s = document.createElement('span');
        s.style.cssText = `position:absolute;left:${
          10 + Math.random() * 80
        }%;top:0;width:6px;height:9px;border-radius:2px;background:${
          cols[i % cols.length]
        };animation:confettiFall ${0.9 + Math.random() * 0.7}s ${
          Math.random() * 0.3
        }s ease-in forwards;opacity:0;`;
        cont.appendChild(s);
      }
      setTimeout(() => {
        cont.innerHTML = '';
      }, 2200);
    };
    const anim6 = (sp: number, P: number) => {
      el.s6list.forEach((r, i) => {
        const a = mc(sp, 0.12 + i * 0.1, 0.24 + i * 0.1);
        r.style.opacity = String(a);
        r.style.transform = `translateY(${lerp(14, 0, eo(a))}px)`;
      });
      if (el.s6bar) {
        const bar = lerp(120, 0, eo(mc(sp, 0.32, 0.52)));
        el.s6bar.style.transform = `translateY(${bar}%)`;
      }
      if (el.s6rank) {
        const rk = Math.round(lerp(9999, 5696, eo(mc(sp, 0.34, 0.72))));
        el.s6rank.textContent = bn(rk);
      }
      if (!confettiDone && P > 7.15 && P < 7.9) {
        confettiDone = true;
        fireConfetti();
      }
    };

    // ---- main render ----
    const render = (now: number) => {
      const time = (now - t0) / 1000;
      const tr = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = track.offsetHeight - vh;
      const prog = clamp(-tr.top / travel, 0, 1);
      const P = prog * 8;

      // phone scale + position (right side throughout)
      const px = 64;
      el.phone!.style.left = px + '%';
      const pushT = eio(mc(P, 0.0, 0.9));
      const phoneY = lerp(0.79 * vh, 0.5 * vh, pushT);
      el.phone!.style.top = phoneY + 'px';
      el.phone!.style.transform = `translate(-50%,-50%) scale(${phoneScale})`;

      // dark sunset sky fades to light gradient as the feature tour begins
      if (el.heroBg) {
        const bgo = 1 - mc(P, 1.4, 2.05);
        el.heroBg.style.opacity = String(bgo);
        el.heroBg.style.visibility = bgo < 0.01 ? 'hidden' : 'visible';
      }

      // header: toggle CSS state classes (CSS handles the fluid transitions)
      if (el.siteHeader) {
        const scrolled = window.scrollY > 56;
        el.siteHeader.classList.toggle('scrolled', scrolled);

        // detect background tone behind the header (1 = dark, 0 = light), smoothed
        const sampleY = 46;
        let targetDark = 0;
        const rTrack = track.getBoundingClientRect();
        if (rTrack.top <= sampleY && rTrack.bottom > sampleY) {
          targetDark = 1 - mc(P, 1.4, 2.05); // dark hero -> light gradient
        } else {
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
        el.siteHeader.classList.toggle('tone-dark', dark);
        el.siteHeader.classList.toggle('tone-light', !dark);

        // collapse the logo box width (CSS transitions it); two discrete targets
        if (el.hdrLogoBox) {
          const fullW = el.hdrLogoFull?.offsetWidth || 150;
          const birdW = el.hdrLogoBird?.offsetWidth || 34;
          if (fullW > 1) el.hdrLogoBox.style.width = (scrolled ? birdW : fullW) + 'px';
        }
      }

      // screens crossfade — screen 0 (home) held through the showcase pan (P 0..2)
      let screen0op = 0;
      for (let k = 0; k < 7; k++) {
        let op: number;
        if (k === 0) {
          op = clamp((2.1 - P) / 0.2, 0, 1);
          screen0op = op;
        } else {
          const c = k + 1;
          op = clamp(Math.min((P - (c - 0.2)) / 0.2, 1, (c + 1 - P) / 0.2), 0, 1);
        }
        const s = el.screens[k];
        if (!s) continue;
        s.style.opacity = String(op);
        s.style.zIndex = String(Math.round(op * 10) + 1);
        s.style.visibility = op < 0.01 ? 'hidden' : 'visible';
      }
      // home showcase: collapsing-header scroll (per Figma "Homepage Scrolling Behavior")
      if (el.homeContentInner && el.homeContent) {
        const sc = eio(mc(P, 0.15, 2.0));
        const maxInner = Math.max(
          0,
          el.homeContentInner.scrollHeight - el.homeContent.clientHeight
        );
        // content starts 202px below the pinned header (=no overlap at load) but
        // "catches up" the extra 36px during the collapse so it butts flush to the
        // header exactly when the hero locks (removes the lingering blue strip).
        const gap = 36;
        const innerScroll = sc * Math.max(0, maxInner - gap); // app-coord px
        const catchup = gap * mc(innerScroll, 0, 166);
        el.homeContentInner.style.transform = `translateY(${-(innerScroll + catchup)}px)`;

        // hero collapses 375 -> 209px over the first 166px of scroll, then locks
        const cp = mc(innerScroll, 0, 166);
        if (el.homeHeroBg) el.homeHeroBg.style.height = lerp(375, 209, cp) + 'px';
        // shadow under the compact header fades in once collapsed (separates it from content)
        if (el.heroCompactBg)
          el.heroCompactBg.style.boxShadow = `0 6px 16px rgba(8,16,45,${0.42 * cp})`;
        // inverse corners appear exactly as the content arrives flush under the header
        const invOp = mc(innerScroll, 145, 166);
        el.invCorners.forEach((c) => (c.style.opacity = String(invOp)));
        if (el.heroExpand) {
          // greeting + focus hub move up with the hero, fade as content overlaps them
          el.heroExpand.style.transform = `translateY(${-Math.min(innerScroll, 166)}px)`;
          el.heroExpand.style.opacity = String(1 - mc(innerScroll, 90, 175));
        }

        // priority-subject bars fill as they scroll into view
        const pw = [
          [0.3, 0.45],
          [0.34, 0.49],
          [0.38, 0.53],
          [0.42, 0.57],
        ];
        el.ppfills.forEach((f, i) => {
          const pct = +(f.getAttribute('data-pct') || '0');
          const w = pw[i] || [0, 1];
          f.style.width = eo(mc(sc, w[0], w[1])) * pct + '%';
        });
        // course-progress quarter pills fill
        const qw = [
          [0.56, 0.7],
          [0.62, 0.76],
        ];
        el.qpfills.forEach((f, i) => {
          const pct = +(f.getAttribute('data-pct') || '0');
          const w = qw[i] || [0, 1];
          f.style.width = eo(mc(sc, w[0], w[1])) * pct + '%';
        });
      }
      if (el.statusBar) el.statusBar.style.opacity = screen0op > 0.5 ? '0' : '1';

      if (el.glow) el.glow.style.opacity = '0';

      // hero left choreography: big title -> single title + CTA + rolling stats,
      // then the whole left column fades as the feature beats begin
      if (el.hero) {
        const leftOut = mc(P, 1.92, 2.06); // fades once both stat rows have been read
        el.hero.style.opacity = String(1 - leftOut);
        el.hero.style.transform = `translateY(${lerp(0, -30, leftOut)}px)`;
        el.hero.style.visibility = leftOut >= 1 ? 'hidden' : 'visible';
      }
      const tint = 1 - mc(P, 1.0, 1.5); // 1 = dark hero bg, 0 = light
      if (el.heroBig) {
        const o = 1 - mc(P, 0.45, 0.95);
        el.heroBig.style.opacity = String(o);
        el.heroBig.style.transform = `translateY(${lerp(0, -18, mc(P, 0.45, 0.95))}px)`;
      }
      if (el.heroSingle) {
        el.heroSingle.style.opacity = String(mc(P, 0.85, 1.1));
        el.heroSingle.style.color = `rgb(${Math.round(lerp(22, 255, tint))},${Math.round(lerp(27, 255, tint))},${Math.round(lerp(51, 255, tint))})`;
      }
      // lift the CTA + stats up as the big title collapses, so the CTA sits near the title
      if (el.heroLower) {
        const collapse = eo(mc(P, 0.5, 1.0));
        el.heroLower.style.transform = `translateY(${-heroGap * collapse}px)`;
      }
      if (el.heroStats) {
        el.heroStats.style.opacity = String(mc(P, 0.88, 1.08));
        // fast odometer: row A lands quickly, holds; row B lands quickly later
        el.hreels.forEach((c) => {
          const offset = +(c.getAttribute('data-offset') || 0);
          const si = +(c.getAttribute('data-stat') || 0);
          const inRow = si % 2;
          const rollNp = si < 2 ? mc(P, 0.98, 1.14) : mc(P, 1.58, 1.72);
          const sp = eo(clamp((rollNp - inRow * 0.05) / 0.85, 0, 1));
          c.style.transform = `translateY(${-sp * offset * 40}px)`;
        });
        // row A squeezes its width + drops away & fades; then row B fades in and settles
        const aLeave = eo(mc(P, 1.4, 1.58));
        const bAppear = eo(mc(P, 1.54, 1.76));
        if (el.statRowA) {
          el.statRowA.style.transformOrigin = 'center center';
          el.statRowA.style.transform = `translateY(${lerp(0, 46, aLeave)}px) scaleX(${lerp(1, 0.2, aLeave)})`;
          el.statRowA.style.opacity = String(1 - aLeave);
          el.statRowA.style.zIndex = '1';
        }
        if (el.statRowB) {
          el.statRowB.style.transform = `translateY(${lerp(16, 0, bAppear)}px)`;
          el.statRowB.style.opacity = String(bAppear);
          el.statRowB.style.zIndex = '2';
        }
      }
      if (el.hint) el.hint.style.opacity = String(1 - mc(P, 0.02, 0.12));

      // foreground fog lifts as feature beats begin
      if (el.fog) {
        const fo = 1 - mc(P, 0.55, 1.05);
        el.fog.style.opacity = String(fo);
        const lift = mc(P, 0.55, 1.05) * 22;
        const driftX = Math.sin(time * 0.55) * 2.6;
        const breathe = 1 + Math.sin(time * 0.9) * 0.016;
        el.fog.style.transform = `translate(${driftX}%, ${lift}%) scale(${breathe})`;
        el.fog.style.transformOrigin = '50% 100%';
        el.fog.style.visibility = fo < 0.01 ? 'hidden' : 'visible';
      }
      if (el.fogBase) {
        const fo = 1 - mc(P, 0.55, 1.05);
        el.fogBase.style.opacity = String(fo);
        el.fogBase.style.transform = `translateY(${mc(P, 0.55, 1.05) * 22}%)`;
        el.fogBase.style.visibility = fo < 0.01 ? 'hidden' : 'visible';
      }

      // student holds the phone, breathes, sinks away at the end
      if (el.student) {
        const fade = mc(P, 0.1, 0.62);
        const op = 1 - fade;
        el.student.style.opacity = String(op);
        const bob = Math.sin(time * 0.8) * 0.45;
        const drift = fade * 5;
        el.student.style.transform = `translateX(-50%) translateY(${bob + drift}%)`;
        el.student.style.visibility = op < 0.01 ? 'hidden' : 'visible';
      }

      // clouds dissipate
      if (el.cloudsB) {
        const c = mc(P, 0.0, 0.85);
        el.cloudsB.style.opacity = String(1 - c);
        el.cloudsB.style.transform = `translateY(${-c * 13}%) scale(${1 + c * 0.18})`;
      }
      if (el.cloudsF) {
        const cf = mc(P, 0.0, 0.62);
        el.cloudsF.style.opacity = String(1 - cf);
        el.cloudsF.style.transform = `translateY(${cf * 16}%) scale(${1 + cf * 0.12})`;
      }

      // ---- RAIL ----
      if (el.rail && el.railBird && el.railFill) {
        const railOp = mc(P, 1.9, 2.2);
        el.rail.style.opacity = String(railOp);
        const Pr = P - 1;
        const seg = Math.floor(clamp(Pr, 1, 6.999));
        const frac = clamp(Pr, 1, 7) - seg;
        const moveT = eio(mc(frac, 0.78, 1.0));
        const mi = clamp(seg - 1 + moveT, 0, 5);
        el.railBird.style.top = mi * 20 + '%';
        el.railFill.style.height = mi * 20 + '%';
        const activeBeat = Math.round(mi);
        el.rdots.forEach((d, i) => {
          const on = i === activeBeat;
          d.style.background = on ? 'var(--accent)' : '#fff';
          d.style.borderColor = on ? 'var(--accent)' : 'rgba(45,71,151,.3)';
          d.style.transform = on ? 'scale(1.25)' : 'scale(1)';
        });
        el.rlabs.forEach((l, i) => {
          l.style.color = i === activeBeat ? '#161B33' : '#9aa2bd';
        });
      }

      // ---- BEAT TEXTS ----
      el.beats.forEach((b, i) => {
        if (!b) return;
        const k = i + 1;
        const sp = P - (k + 1);
        const opIn = clamp((sp + 0.18) / 0.18, 0, 1);
        const opOut = clamp((1.05 - sp) / 0.18, 0, 1);
        const op = Math.min(opIn, opOut);
        b.style.opacity = String(op);
        const ty = (1 - opIn) * 34 + (1 - opOut) * -28;
        b.style.transform = `translateY(calc(-50% + ${ty}px))`;
        b.style.visibility = op < 0.01 ? 'hidden' : 'visible';
      });

      // ---- MICRO-ANIMS ----
      anim1(clamp(P - 2, 0, 1));
      anim2(clamp(P - 3, 0, 1));
      anim3(clamp(P - 4, 0, 1));
      anim4(clamp(P - 5, 0, 1));
      anim5(clamp(P - 6, 0, 1));
      anim6(clamp(P - 7, 0, 1), P);
    };

    let raf = requestAnimationFrame(function loop(now) {
      render(now);
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      style={{ position: 'relative', background: '#FBFAF7' }}
      dangerouslySetInnerHTML={{ __html: MARKUP }}
    />
  );
}
