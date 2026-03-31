import type { Metadata } from "next";
import "./globals.css";
import { noto } from "./fonts";

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
      <head>
        {/* 🔥 ここに直接書く */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-F52LGM1JDL"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-F52LGM1JDL');
            `,
          }}
        />
      </head>

      <body className={`${noto.className} min-h-screen`}>
        {children}
      </body>
    </html>
  );
}