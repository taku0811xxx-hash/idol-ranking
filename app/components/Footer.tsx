"use client";

import { ShieldCheck, ArrowUpRight, Zap, Heart, Shield } from "lucide-react";

export default function Footer({ scrollTo, rankingRef, recommendRef, voteRef, postRef }: any) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 text-white mt-24 relative overflow-hidden">
      {/* 装飾的な背景アクセント */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 blur-[100px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-8 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          
          {/* ブランドエリア (4カラム分) */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl rotate-3">
                <ShieldCheck className="text-slate-900" size={24} />
              </div>
              <span className="text-2xl font-black italic uppercase tracking-tighter">
                GRAVURE<span className="text-pink-500">RANK</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
              次世代のグラビアアイドルデータベース。
              あなたの「推し」を、もっと身近に、もっと美しく。
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-pink-500 transition-colors cursor-pointer group">
                <Zap size={18} className="text-slate-500 group-hover:text-pink-500" />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-pink-500 transition-colors cursor-pointer group">
                <Heart size={18} className="text-slate-500 group-hover:text-pink-500" />
              </div>
            </div>
          </div>

          {/* ナビゲーションエリア (8カラム分) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-12">
            
            {/* Explore */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Explore</h3>
              <ul className="space-y-4 text-sm font-bold">
                <li>
                  <button onClick={() => scrollTo(rankingRef)} className="text-slate-400 hover:text-white transition-all flex items-center gap-1 group">
                    Ranking <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-y-1 transition-all" />
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo(recommendRef)} className="text-slate-400 hover:text-white transition-all flex items-center gap-1 group">
                    Recommend <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-y-1 transition-all" />
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo(voteRef)} className="text-slate-400 hover:text-white transition-all flex items-center gap-1 group">
                    Voting <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-y-1 transition-all" />
                  </button>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Account</h3>
              <ul className="space-y-4 text-sm font-bold">
                <li><a href="/login" className="text-slate-400 hover:text-white transition-colors">Sign In</a></li>
                <li><a href="/register" className="text-slate-400 hover:text-white transition-colors">Create Account</a></li>
                <li><button onClick={() => scrollTo(postRef)} className="text-pink-500 hover:text-pink-400 transition-colors italic">Submit New Idol</button></li>
              </ul>
            </div>

            {/* Legal / Contact */}
            <div className="space-y-6 col-span-2 sm:col-span-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Legal</h3>
              <ul className="space-y-4 text-sm font-bold">
                <li><a href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="/about" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"><Shield size={14}/> Admin Info</a></li>
              </ul>
            </div>

          </div>
        </div>

        {/* 下部ボーダーとコピーライト */}
        <div className="mt-20 pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
            © {currentYear} Gravure Rank. Built for the next gen.
          </div>
          <div className="flex gap-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <span className="hover:text-slate-400 cursor-pointer">Twitter</span>
            <span className="hover:text-slate-400 cursor-pointer">Instagram</span>
            <span className="hover:text-slate-400 cursor-pointer">TikTok</span>
          </div>
        </div>
      </div>
    </footer>
  );
}