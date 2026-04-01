"use client";

import Link from "next/link";
import { Trophy, Star, Home, ImagePlus } from "lucide-react";

const TAG_OPTIONS = [
  "清楚","童顔","巨乳","セクシー","ギャル","ナチュラル","お姉さん","ロリ系",
  "スレンダー","くびれ","美脚","高身長","低身長","グラマラス",
  "クール","可愛い系","大人系","癒し系","透明感",
  "コスプレ","アイドル系","女優系","インフルエンサー"
];

export default function SidebarContent({
  showTags,
  setShowTags,
}: any) {
  return (
    <div className="p-4 space-y-4 text-sm">

      <div className="font-bold text-lg mb-6">MENU</div>

      <div className="space-y-4">

        <Link href="/" className="flex gap-2 hover:text-pink-500">
          <Trophy size={16}/> ランキング
        </Link>

        <Link href="/" className="flex gap-2 hover:text-pink-500">
          <Star size={16}/> おすすめ
        </Link>

        <Link href="/" className="flex gap-2 hover:text-pink-500">
          <Home size={16}/> 投票
        </Link>

        <Link href="/" className="flex gap-2 hover:text-pink-500">
          <ImagePlus size={16}/> 投稿
        </Link>

        {/* タグ */}
        <div className="mt-6">
          <button
            onClick={() => setShowTags(!showTags)}
            className="font-bold flex items-center gap-2 hover:text-pink-500"
          >
            タグ {showTags ? "▲" : "▼"}
          </button>

          {showTags && (
            <div className="space-y-2 mt-3">
              {TAG_OPTIONS.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className="block text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded hover:bg-pink-200"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/register" className="block hover:text-pink-500">
            会員登録
        </Link>

        <Link href="/login" className="block hover:text-pink-500">
        ログイン
        </Link>

        <Link href="/privacy" className="block hover:text-pink-500">
        プライバシーポリシー
        </Link>

        <Link href="/contact" className="block hover:text-pink-500">
        お問い合わせ
        </Link>

        <Link href="/about" className="block hover:text-pink-500">
        運営者情報
        </Link>

      </div>
    </div>
  );
}