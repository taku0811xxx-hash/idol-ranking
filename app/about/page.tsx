"use client";

import { motion } from "framer-motion";
import { Info, Mail, Zap, ArrowLeft, ShieldCheck, Globe } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="md:ml-56 flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* メインコンテンツ */}
      <main className="flex-1 pt-24 pb-32 px-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* ヘッダーセクション */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-slate-900 text-pink-500 p-3 rounded-2xl shadow-xl -rotate-3">
                <Info size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                  About <span className="text-pink-500">Project</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">Operator Information</p>
              </div>
            </div>
            <div className="h-1 w-20 bg-slate-900 rounded-full" />
          </div>

          {/* メインカード */}
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 md:p-16 overflow-hidden relative">
            {/* 装飾用の巨大な背景文字 */}
            <div className="absolute top-0 right-0 p-10 font-black italic text-[120px] text-slate-50 leading-none pointer-events-none select-none">
              PROTO
            </div>

            <div className="relative z-10 space-y-16">
              
              {/* ビジョン・コンセプト */}
              <section className="space-y-6">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-pink-500 flex items-center gap-2">
                  <Zap size={14} fill="currentColor" /> Our Vision
                </h2>
                <p className="text-3xl font-black italic text-slate-900 leading-[1.1] tracking-tighter">
                  アイドルの「今」を、<br />
                  最も美しくアーカイブする。
                </p>
                <p className="text-slate-500 leading-relaxed font-medium max-w-2xl">
                  Gravure Rank（グラビアランク）は、次世代のアイドルデータベースとして、
                  ファンの熱量を可視化し、新たな才能が発見される場所を提供します。
                  クリエイティブな視点で、アイドルの魅力を世界へ発信します。
                </p>
              </section>

              {/* 運営詳細テーブル */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-50 pt-12">
                
                <div className="space-y-8">
                  <div className="group">
                    <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2">
                      <Globe size={12} /> Service Name
                    </div>
                    <div className="text-2xl font-black italic text-slate-900 uppercase tracking-tighter group-hover:text-pink-500 transition-colors">
                      Gravure Rank
                    </div>
                  </div>

                  <div className="group">
                    <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2">
                      <ShieldCheck size={12} /> Operator
                    </div>
                    <div className="text-2xl font-black italic text-slate-900 uppercase tracking-tighter group-hover:text-pink-500 transition-colors">
                      Proto Admin Team
                    </div>
                  </div>
                </div>

                {/* コンタクトボックス */}
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 blur-3xl rounded-full group-hover:bg-pink-500/40 transition-all" />
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2 text-pink-500 text-[10px] font-black uppercase tracking-widest">
                      <Mail size={16} /> Contact Support
                    </div>
                    <p className="text-slate-300 text-xs font-medium leading-relaxed">
                      掲載情報の修正依頼、権利に関するご連絡、広告掲載のご相談はこちらから。
                    </p>
                    <Link 
                      href="/contact" 
                      className="inline-block w-full text-center bg-white text-slate-900 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-pink-500 hover:text-white transition-all shadow-xl active:scale-95"
                    >
                      Contact Page
                    </Link>
                  </div>
                </div>

              </div>

              {/* 制定・コピーライト */}
              <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-50">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                  © 2026 Gravure Rank / Powered by Proto.
                </p>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full">
                  Authentic Idol Database
                </div>
              </div>
            </div>
          </div>

          {/* フッターリンク */}
          <Link 
            href="/" 
            className="mt-12 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Dashboard
          </Link>

        </motion.div>
      </main>
    </div>
  );
}