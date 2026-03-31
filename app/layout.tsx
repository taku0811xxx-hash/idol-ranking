import type { Metadata } from "next";
import "./globals.css";
import { noto } from "./fonts";
import Script from "next/script";
import GA from "./GA";

export const metadata: Metadata = {
  title: "ランキング｜人気投票サイト",
  description:
    "人気アイドルをランキング形式で紹介。投票で順位が変動する参加型サイト。",
  keywords: ["グラビア", "アイドル", "ランキング", "人気", "投票"],
  verification: {
    google: "78uSALJmInWnO_vLJV0TI9nJujf_UxHyfjnjgEJ8958",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${noto.className} min-h-screen overflow-x-hidden`}>
        
        {/* 🔥 Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-F52LGM1JDL"
          strategy="afterInteractive"
        />
        <Script id="ga" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag; // ← これ追加（重要）

          gtag('js', new Date());

          gtag('config', 'G-F5L2GM1JDL', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

        {/* 🔥 ページ遷移計測 */}
        <GA />

        {children}
      </body>
    </html>
  );
}