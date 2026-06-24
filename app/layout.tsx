import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shikho — শেখাটা এখন আরও স্মার্ট।",
  description:
    "SSC ও HSC প্রস্তুতির সবচেয়ে স্মার্ট সঙ্গী — AI ক্লাস, ইনস্ট্যান্ট উত্তর আর পার্সোনালাইজড গাইডেন্স, সব এক অ্যাপে।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
