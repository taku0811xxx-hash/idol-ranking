"use client";

import { useRef } from "react";
import { Trophy, Star, Home, ImagePlus } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  const rankingRef = useRef<HTMLDivElement>(null);
  const recommendRef = useRef<HTMLDivElement>(null);
  const voteRef = useRef<HTMLDivElement>(null);
  const postRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: any) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ヘッダー */}
      <div className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 pt-3 pb-5">
          <Link href="/" className="text-2xl font-bold text-pink-500">
            Idol Ranking
          </Link>
        </div>
      </div>

      <div className="h-10"></div>

      <div className="bg-gradient-to-br from-pink-50 via-white to-purple-50 min-h-screen">

        {/* サイドバー */}
        <aside className="hidden md:block fixed left-0 top-15 h-screen w-56 bg-white/80 backdrop-blur border-r p-4 z-40">
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

                {/* 👇 ここ追加 */}
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
            </aside>

        {/* ここがポイント */}
        <div className="md:ml-56 flex flex-col min-h-screen">

          {/* メイン */}
          <main className="flex-1 pt-10 pb-20 px-4">

            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow">

              <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                プライバシーポリシー
              </h1>

              <div className="space-y-8 text-sm leading-relaxed text-gray-700">
                <section>
                  <h2 className="font-bold text-lg mb-2">■ 個人情報の利用目的</h2>
                  <p>お問い合わせ時に取得した情報は対応のために利用します。</p>
                </section>

                <section>
                  <h2 className="font-bold text-lg mb-2">■ 広告について</h2>
                  <p>Google AdSenseを利用予定です。</p>
                </section>

                <section>
                  <h2 className="font-bold text-lg mb-2">■ アクセス解析ツールについて</h2>
                  <p>Google Analyticsを利用しています。</p>
                </section>

                <section>
                  <h2 className="font-bold text-lg mb-2">■ 免責事項</h2>
                  <p>当サイトの情報による損害について責任を負いません。</p>
                </section>

                <div className="text-right text-xs text-gray-400 pt-6 border-t">
                  制定日：2026年3月30日
                </div>
              </div>

            </div>
          </main>

          {/* フッター（同じコンテナ内に入れる） */}
          <footer className="bg-gray-900 text-white mt-16">
            <div className="max-w-6xl mx-auto px-4 py-20">

              <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-sm text-center md:text-left">

                <div>
                  <div className="font-bold mb-4">サイト</div>
                  <div className="space-y-3 text-gray-400">
                    <Link href="/" className="block">ランキング</Link>
                    <Link href="/" className="block">おすすめ</Link>
                  </div>
                </div>

                <div>
                  <div className="font-bold mb-4">機能</div>
                  <div className="space-y-3 text-gray-400">
                    <Link href="/" className="block">投票</Link>
                    <Link href="/" className="block">投稿</Link>
                  </div>
                </div>

                <div>
                  <div className="font-bold mb-4">アカウント</div>
                  <div className="space-y-3 text-gray-400">
                    <Link href="/login" className="block">ログイン</Link>
                    <Link href="/register" className="block">会員登録</Link>
                  </div>
                </div>

                <div>
                  <div className="font-bold mb-4">その他</div>
                  <div className="space-y-3 text-gray-400">
                    <Link href="/privacy" className="block">プライバシーポリシー</Link>
                    <Link href="/contact" className="block">お問い合わせ</Link>
                    <Link href="/about" className="block">運営者情報</Link>
                  </div>
                </div>

              </div>

              <div className="border-t border-gray-700 my-10"></div>

              <div className="text-center text-xs text-gray-400">
                © 2026 Gravure Rank
              </div>

            </div>
          </footer>

        </div>
      </div>
    </>
  );
}