import { Noto_Sans_JP, Playfair_Display } from "next/font/google";

// 本文
export const noto = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

// タイトル
export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});