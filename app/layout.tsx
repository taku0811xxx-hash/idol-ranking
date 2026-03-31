import type { Metadata } from "next";
import "./globals.css";
import { noto } from "./fonts";

export const metadata: Metadata = {
  title: "ランキング｜人気投票サイト",
  description:
    "人気アイドルをランキング形式で紹介。投票で順位が変動する参加型サイト。",
  keywords: ["グラビア", "アイドル" , "ランキング", "人気", "投票"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${noto.className} min-h-screen`}>
        {children}
      </body>
    </html>
  );
}