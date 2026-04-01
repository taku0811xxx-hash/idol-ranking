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

        </div>
    </>
  );
}