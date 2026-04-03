"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Trophy, Star, Home, ImagePlus, Hash, 
  Sparkles, User, Heart, Zap, ChevronDown, ChevronUp 
} from "lucide-react";

// 🌟 カテゴリー辞書　カテゴリー追加時はここを修正
const CATEGORY_MAP: Record<string, { label: string; icon: any }> = {
  STYLE: { label: "Style / 雰囲気", icon: Sparkles },
  BODY: { label: "Body / 特徴", icon: User },
  CHARA: { label: "Character / 属性", icon: Heart },
  SPECIAL: { label: "Special / 活動", icon: Zap },
  OTHER: { label: "Others", icon: Hash },
};

// 🌟 分類マスター辞書　タグ追加時はここを修正
const TAG_DISTRIBUTION: Record<string, string> = {
  "清楚": "STYLE", "ナチュラル": "STYLE", "お姉さん": "STYLE", "癒し系": "STYLE", "透明感": "STYLE", "大人系": "STYLE", "クール": "STYLE", "ギャル": "STYLE",
  "巨乳": "BODY", "セクシー": "BODY", "スレンダー": "BODY", "くびれ": "BODY", "美脚": "BODY", "高身長": "BODY", "低身長": "BODY", "グラマラス": "BODY",
  "童顔": "CHARA", "ロリ系": "CHARA", "可愛い系": "CHARA",
  "コスプレ": "SPECIAL", "インフルエンサー": "SPECIAL", "アイドル系": "SPECIAL", "女優系": "SPECIAL", "新人": "SPECIAL"
};

export default function SidebarContent({ showTags, setShowTags, popularTags = [] }: any) {
  const pathname = usePathname();

  // 🌟 タグのグループ化ロジック
  const groupedTags = useMemo(() => {
    // 取得データがない場合は辞書にあるものをデフォルト(0件)として表示
    const source = (popularTags && popularTags.length > 0) 
      ? popularTags 
      : Object.keys(TAG_DISTRIBUTION).map(name => ({ name, count: 0 }));

    return source.reduce((acc: any, tag: any) => {
      const catId = TAG_DISTRIBUTION[tag.name] || "OTHER";
      if (!acc[catId]) acc[catId] = [];
      acc[catId].push(tag);
      return acc;
    }, {});
  }, [popularTags]);

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
      <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Menu</div>
      <div className="space-y-1">
        <Link href="/" className={getLinkClass("/")}><Home size={18}/> ホーム</Link>
        <Link href="/ranking" className={getLinkClass("/ranking")}><Trophy size={18}/> ランキング</Link>
        <Link href="/recommend" className={getLinkClass("/recommend")}><Star size={18}/> おすすめ</Link>
        <Link href="/vote" className={getLinkClass("/vote")}><Hash size={18}/> 投票</Link>
        <Link href="/post" className={getLinkClass("/post")}><ImagePlus size={18}/> 投稿</Link>
      </div>

      <div className="mt-8">
        <button
          onClick={() => setShowTags(!showTags)}
          className="w-full flex items-center justify-between px-4 py-2 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] hover:text-pink-500 transition-colors"
        >
          Explore Tags 
          <span className="ml-2">{showTags ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}</span>
        </button>

        {showTags && (
          <div className="mt-4 space-y-6 px-2">
            {Object.entries(CATEGORY_MAP).map(([catId, info]) => {
              const tags = groupedTags[catId];
              if (!tags || tags.length === 0) return null;
              
              const Icon = info.icon;
              return (
                <div key={catId} className="space-y-2">
                  <div className="flex items-center gap-2 px-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    <Icon size={10} className="text-pink-300" />
                    {info.label}
                  </div>
                  <div className="grid grid-cols-1 gap-0.5">
                    {tags.map((tag: any) => (
                      <Link
                        key={tag.name}
                        href={`/tag/${encodeURIComponent(tag.name)}`}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          pathname === `/tag/${encodeURIComponent(tag.name)}`
                            ? "bg-pink-50 text-pink-600"
                            : "text-slate-500 hover:bg-slate-50 hover:text-pink-500"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="opacity-30 font-normal">#</span> {tag.name}
                        </span>
                        <span className="text-[9px] opacity-30 font-black">{tag.count}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="my-6 border-t border-slate-100 mx-4"></div>

      <div className="space-y-1 px-2 pb-10">
        <Link href="/register" className="block px-3 py-2 text-slate-500 hover:text-pink-500 font-bold text-xs">会員登録</Link>
        <Link href="/login" className="block px-3 py-2 text-slate-500 hover:text-pink-500 font-bold text-xs">ログイン</Link>
        <Link href="/privacy" className="block px-3 py-2 text-slate-400 hover:text-pink-500 text-[10px] font-medium">プライバシーポリシー</Link>
      </div>
    </div>
  );
}