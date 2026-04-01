import Link from "next/link";
import { Trophy, Star, Home, ImagePlus } from "lucide-react";

export default function SidebarContent({
  showTags,
  setShowTags,
  popularTags,
}: any) {
  return (
    <div className="p-4 space-y-4 text-sm">

      <div className="font-bold text-lg mb-6">MENU</div>

      <div className="space-y-4 text-sm">

        <Link href="/" className="flex gap-2 hover:text-pink-500 transition">
          <Trophy size={16}/> ランキング
        </Link>

        <Link href="/" className="flex gap-2 hover:text-pink-500 transition">
          <Star size={16}/> おすすめ
        </Link>

        <Link href="/" className="flex gap-2 hover:text-pink-500 transition">
          <Home size={16}/> 投票
        </Link>

        <Link href="/" className="flex gap-2 hover:text-pink-500 transition">
          <ImagePlus size={16}/> 投稿
        </Link>

        {/* タグ */}
        <div className="mt-6">
          <button
            onClick={() => setShowTags(!showTags)}
            className="font-bold text-sm mb-2 flex items-center gap-2 hover:text-pink-500 transition"
          >
            タグ {showTags ? "▲" : "▼"}
          </button>

          {showTags && (
            <div className="space-y-2 mt-2">
              {(popularTags || []).map((tag: any) => (
                <Link
                    key={tag.name}
                    href={`/tag/${encodeURIComponent(tag.name)}`}
                    className="block text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded"
                >
                    #{tag.name}
                </Link>
                ))}
            </div>
          )}
        </div>

        {/* 👇 ここ重要（消えてた部分） */}
        <Link href="/register" className="flex gap-2 hover:text-pink-500 transition">
          会員登録
        </Link>

        <Link href="/login" className="flex gap-2 hover:text-pink-500 transition">
          ログイン
        </Link>

        <Link href="/privacy" className="flex gap-2 hover:text-pink-500 transition">
          プライバシーポリシー
        </Link>

        <Link href="/contact" className="flex gap-2 hover:text-pink-500 transition">
          お問い合わせ
        </Link>

        <Link href="/about" className="flex gap-2 hover:text-pink-500 transition">
          運営者情報
        </Link>

      </div>
    </div>
  );
}