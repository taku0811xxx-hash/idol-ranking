"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Header() {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    alert("ログアウトしました");
  };

  return (
    <div className="w-full h-16 bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 gap-4">

        {/* 左：タイトル */}
        <Link href="/" className="flex flex-col leading-tight">
            <span className="text-xl md:text-2xl font-bold text-pink-500">
                アイドルランキング
            </span>
            <span className="text-[10px] md:text-xs text-gray-400 tracking-widest">
                FIND YOUR FAVORITE IDOL
            </span>
            </Link>

        {/* 中央：検索 */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-md">

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim()) {
                  window.location.href = `/search?q=${search}`;
                }
              }}
              placeholder="検索..."
              className="border px-4 pr-16 py-2 rounded-full w-full"
            />

            <button
              onClick={() => {
                if (search.trim()) {
                  window.location.href = `/search?q=${search}`;
                }
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-pink-500 text-white px-3 py-1 rounded-full text-sm"
            >
              検索
            </button>

          </div>
        </div>

        {/* 🔥 右：ログイン系 */}
        <div className="flex items-center gap-3 text-sm">

          {!user && (
            <>
              <Link href="/login" className="text-blue-500">
                ログイン
              </Link>
              <Link href="/register" className="text-blue-500">
                会員登録
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                href="/mypage"
                className="px-3 py-1 border rounded-lg hover:bg-pink-50"
              >
                👤 マイページ
              </Link>

              <button
                onClick={logout}
                className="bg-gray-500 text-white px-3 py-1 rounded"
              >
                ログアウト
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
}