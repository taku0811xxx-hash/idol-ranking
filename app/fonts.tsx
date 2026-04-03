import { Noto_Sans_JP, Playfair_Display } from "next/font/google";

// 本文・システム用：ウェイトをフル活用できるように調整
export const noto = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-noto", // CSS変数として使いたい場合
});

// タイトル・アクセント用：イタリック（斜体）を明示的に追加
export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"], // さらに太い900を追加
  style: ["normal", "italic"], // イタリック体を読み込む
  display: "swap",
  variable: "--font-playfair",
});