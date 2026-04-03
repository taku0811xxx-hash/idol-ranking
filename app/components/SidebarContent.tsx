"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Star, Home, ImagePlus, Hash } from "lucide-react";

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
  const pathname = usePathname();

  // アクティブ時と通常時の共通クラスを関数化
  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-bold ${
      isActive 
        ? "bg-pink-50 text-pink-600 shadow-sm shadow-pink-100" 
        : "text-slate-600 hover:bg-slate-50 hover:text-pink-500"
    }`;
  };

  return (
    <div className="p-4 space-y-2 text-sm">
      {/* メニュー見出し */}
      <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        Menu
      </div>

      {/* メインリンク一覧 */}
      <div className="space-y-1">
        <Link href="/" className={getLinkClass("/")}>
          <Home size={18}/> ホーム
        </Link>

        <Link href="/ranking" className={getLinkClass("/ranking")}>
          <Trophy size={18}/> ランキング
        </Link>

        <Link href="/recommend" className={getLinkClass("/recommend")}>
          <Star size={18}/> おすすめ
        </Link>

        <Link href="/vote" className={getLinkClass("/vote")}>
          <Hash size={18}/> 投票
        </Link>

        <Link href="/post" className={getLinkClass("/post")}>
          <ImagePlus size={18}/> 投稿
        </Link>
      </div>

      {/* タグセクション */}
      <div className="mt-6">
        <button
          onClick={() => setShowTags(!showTags)}
          className="w-full flex items-center justify-between px-4 py-2 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] hover:text-pink-500 transition-colors"
        >
          Tags <span>{showTags ? "▲" : "▼"}</span>
        </button>

        {showTags && (
          <div className="grid grid-cols-1 gap-1 mt-2 px-2">
            {TAG_OPTIONS.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  pathname === `/tag/${encodeURIComponent(tag)}`
                    ? "bg-pink-50 text-pink-600"
                    : "text-slate-500 hover:bg-pink-50/50 hover:text-pink-500"
                }`}
              >
                <Hash size={12} className="opacity-50" />
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 区切り線 */}
      <div className="my-6 border-t border-slate-100 mx-4"></div>

      {/* サブメニュー */}
      <div className="space-y-1 px-2">
        <Link href="/register" className="block px-3 py-2 text-slate-500 hover:text-pink-500 font-medium">
          会員登録
        </Link>
        <Link href="/login" className="block px-3 py-2 text-slate-500 hover:text-pink-500 font-medium">
          ログイン
        </Link>
        <Link href="/privacy" className="block px-3 py-2 text-slate-400 hover:text-pink-500 text-[11px]">
          プライバシーポリシー
        </Link>
      </div>
    </div>
  );
}