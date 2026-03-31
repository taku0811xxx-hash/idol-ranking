"use client";

import { useState, useRef } from "react";
import { Trophy, Star, Home, ImagePlus } from "lucide-react";
import Link from "next/link";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const rankingRef = useRef<HTMLDivElement>(null);
  const recommendRef = useRef<HTMLDivElement>(null);
  const voteRef = useRef<HTMLDivElement>(null);
  const postRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: any) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 🔥 Firestore保存処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "contacts"), {
        name: form.name,
        email: form.email,
        message: form.message,
        createdAt: serverTimestamp(),
      });

      alert("送信しました！");

      // フォームリセット
      setForm({
        name: "",
        email: "",
        message: "",
      });

    } catch (error) {
      console.error(error);
      alert("送信に失敗しました");
    }
  };

  return (
    <>
      {/* ヘッダー */}
      <div className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
        <div className="max-w-6xl mx-auto px-4 pt-3 pb-5">
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

            <div className="pt-4 border-t space-y-4">
              <Link href="/register" className="flex gap-2 hover:text-pink-500">
                会員登録
              </Link>
              <Link href="/login" className="flex gap-2 hover:text-pink-500">
                ログイン
              </Link>
            </div>

            <div className="pt-4 border-t space-y-4">
              <Link href="/privacy" className="flex gap-2 hover:text-pink-500">
                プライバシーポリシー
              </Link>
              <Link href="/contact" className="flex gap-2 text-pink-500 font-bold">
                お問い合わせ
              </Link>
              <Link href="/about" className="flex gap-2 hover:text-pink-500">
                運営者情報
              </Link>
            </div>

          </div>
        </aside>

        {/* 🔥 レイアウト統一ポイント */}
        <div className="md:ml-56 flex flex-col min-h-screen">

          {/* メイン */}
          <main className="flex-1 pt-10 pb-20 px-4">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow">

              <h1 className="text-2xl font-bold mb-8 text-center">
                お問い合わせ
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">

                <input
                  type="text"
                  placeholder="名前"
                  className="w-full border p-3 rounded"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />

                <input
                  type="email"
                  placeholder="メールアドレス"
                  className="w-full border p-3 rounded"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />

                <textarea
                  placeholder="お問い合わせ内容"
                  className="w-full border p-3 rounded h-40"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />

                <button className="w-full bg-pink-500 text-white py-3 rounded hover:bg-pink-600 transition">
                  送信
                </button>

              </form>
            </div>
          </main>

          {/* フッター */}
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