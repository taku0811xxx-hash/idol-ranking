"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Search, Menu, User, LogOut, Zap } from "lucide-react"; 
import { useRouter } from "next/navigation";

export default function Header({ setIsOpen }: any) {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

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
      className={`w-full h-16 md:h-20 fixed top-0 left-0 z-[50] transition-all duration-500 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm" 
          : "bg-white border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 md:px-6 gap-2 md:gap-12">

        {/* 左側：ブランドロゴ */}
        <div className="flex items-center gap-2 md:gap-6 shrink-0">
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-xl transition-all active:scale-95 text-slate-900"
          >
            <Menu size={20} strokeWidth={2.5} />
          </button>

          <Link href="/" className="flex flex-col group relative shrink-0">
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg md:text-2xl font-black tracking-tighter text-slate-900 group-hover:text-pink-500 transition-colors">
                IDOL<span className="italic text-pink-500 group-hover:text-slate-900">RANK</span>
              </span>
              <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-pink-500 rounded-full animate-pulse" />
            </div>
            <span className="text-[7px] md:text-[9px] font-black text-slate-400 tracking-[0.2em] md:tracking-[0.3em] leading-none uppercase italic">
              Powered by Proto
            </span>
          </Link>
        </div>

        {/* 中央：検索バー（スマホでは非表示にしてはみ出し防止） */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 justify-center max-w-xl px-4"
        >
          <div className="relative w-full group">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="検索..."
              className="w-full bg-slate-100/80 border-2 border-transparent focus:bg-white focus:border-slate-900 px-12 py-2.5 rounded-2xl text-sm font-bold outline-none transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
        </form>

        {/* 右側：アクション */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {!user ? (
            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-pink-500">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 md:px-7 md:py-3 bg-slate-900 text-white rounded-xl md:rounded-[1.2rem] text-[9px] md:text-[11px] font-black uppercase tracking-widest hover:bg-pink-500 transition-all flex items-center gap-1.5">
                <Zap size={12} fill="currentColor" className="hidden xs:block" /> Join
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-4">
              <Link
                href="/mypage"
                className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-slate-900 text-white rounded-xl text-[9px] md:text-[11px] font-black uppercase tracking-widest hover:bg-pink-500 transition-all"
              >
                <User size={12} strokeWidth={2.5} />
                <span className="hidden sm:inline">Dash</span>
              </Link>
              <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-all">
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}