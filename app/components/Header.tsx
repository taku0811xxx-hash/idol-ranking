"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Search, Menu, User, LogOut, Zap } from "lucide-react"; 
import { useRouter } from "next/navigation"; // 追加
import { motion, AnimatePresence } from "framer-motion"; // アニメーション用

export default function Header({ setIsOpen }: any) {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter(); // 追加

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // 検索実行処理
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  const logout = async () => {
    if (confirm("ログアウトしますか？")) {
      await signOut(auth);
    }
  };

  return (
    <header 
      className={`w-full h-20 fixed top-0 left-0 z-[50] transition-all duration-500 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm py-2" 
          : "bg-white border-b border-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6 gap-12">

        {/* 左側：ブランドロゴ */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2.5 hover:bg-slate-100 rounded-2xl transition-all active:scale-95 text-slate-900"
          >
            <Menu size={24} strokeWidth={2.5} />
          </button>

          <Link href="/" className="flex flex-col group relative">
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-black tracking-tighter text-slate-900 group-hover:text-pink-500 transition-colors">
                IDOL<span className="italic text-pink-500 group-hover:text-slate-900">RANK</span>
              </span>
              <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" />
            </div>
            <span className="text-[9px] font-black text-slate-400 tracking-[0.3em] leading-none uppercase italic">
              Powered by Proto
            </span>
          </Link>
        </div>

        {/* 中央：検索バー（進化版） */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 justify-center max-w-xl"
        >
          <div className="relative w-full group">
            <div className="absolute inset-0 bg-pink-500/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="推しのアイドル、キーワードを検索..."
              className="relative w-full bg-slate-100/80 border-2 border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 px-14 py-3 rounded-2xl text-sm font-bold transition-all outline-none placeholder:text-slate-400 placeholder:italic"
            />
            <Search 
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 group-focus-within:scale-110 transition-all duration-300" 
              size={20} 
              strokeWidth={2.5}
            />
            {/* Enterキーのヒントを薄く表示 */}
            <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
              <kbd className="bg-slate-100 px-2 py-1 rounded text-[10px] font-black text-slate-400 border border-slate-200">ENTER</kbd>
            </div>
          </div>
        </form>

        {/* 右側：アクション */}
        <div className="flex items-center gap-4 shrink-0">
          {!user ? (
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden lg:block text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-pink-500 transition-colors">
                Login
              </Link>
              <Link href="/register" className="px-7 py-3 bg-slate-900 text-white rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest hover:bg-pink-500 shadow-xl hover:shadow-pink-500/20 transition-all active:scale-95 flex items-center gap-2">
                <Zap size={14} fill="currentColor" /> Join Now
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/mypage"
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-[1.1rem] text-[11px] font-black uppercase tracking-widest hover:bg-pink-500 transition-all shadow-lg active:scale-95"
              >
                <User size={14} strokeWidth={2.5} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button
                onClick={logout}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
                title="Logout"
              >
                <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}