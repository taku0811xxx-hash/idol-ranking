"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, Scale, PieChart, Megaphone, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 px-6">
      {/* 背景の装飾的なアクセント */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-slate-200/50 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* ヘッダー */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-slate-900 text-pink-500 p-3 rounded-2xl shadow-xl rotate-3">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900">
                Privacy <span className="text-pink-500">Policy</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">Legal Documentation</p>
            </div>
          </div>
          <div className="h-1 w-20 bg-slate-900 rounded-full" />
        </div>

        {/* コンテンツ本体 */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 md:p-16 space-y-16">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            
            {/* 01. 個人情報の利用目的 */}
            <div className="md:col-span-4 flex items-start gap-4">
              <div className="bg-slate-50 p-3 rounded-xl text-slate-400">
                <Scale size={20} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 pt-2">個人情報の利用目的</h2>
            </div>
            <div className="md:col-span-8 text-slate-500 leading-relaxed font-medium">
              <p>当サイトでは、お問い合わせ時に提供いただいた氏名やメールアドレス等の個人情報を、お問い合わせに対する回答や必要な情報を電子メール等でご連絡する場合にのみ利用いたします。これらの目的以外では利用いたしません。</p>
            </div>

            {/* 02. 広告について */}
            <div className="md:col-span-4 flex items-start gap-4 border-t border-slate-50 pt-12">
              <div className="bg-slate-50 p-3 rounded-xl text-slate-400">
                <Megaphone size={20} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 pt-2">広告について</h2>
            </div>
            <div className="md:col-span-8 text-slate-500 leading-relaxed font-medium border-t border-slate-50 pt-12">
              <p>当サイトでは、第三者配信の広告サービス「Google AdSense」を利用する予定です。広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、クッキー（Cookie）を使用することがあります。</p>
            </div>

            {/* 03. 解析ツール */}
            <div className="md:col-span-4 flex items-start gap-4 border-t border-slate-50 pt-12">
              <div className="bg-slate-50 p-3 rounded-xl text-slate-400">
                <PieChart size={20} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 pt-2">解析ツールについて</h2>
            </div>
            <div className="md:col-span-8 text-slate-500 leading-relaxed font-medium border-t border-slate-50 pt-12">
              <p>当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このツールはトラフィックデータの収集のためにクッキー（Cookie）を使用しています。トラフィックデータは匿名で収集されており、個人を特定するものではありません。</p>
            </div>

            {/* 04. 免責事項 */}
            <div className="md:col-span-4 flex items-start gap-4 border-t border-slate-50 pt-12">
              <div className="bg-slate-50 p-3 rounded-xl text-slate-400">
                <AlertCircle size={20} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 pt-2">免責事項</h2>
            </div>
            <div className="md:col-span-8 text-slate-500 leading-relaxed font-medium border-t border-slate-50 pt-12">
              <p>当サイトのコンテンツ・情報について、できる限り正確な情報を掲載するよう努めておりますが、正確性や安全性を保証するものではありません。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。</p>
            </div>

          </div>

          {/* 制定日 */}
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">© Gravure Rank Legal Team</p>
            <div className="px-6 py-2 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
              Last Updated: 2026.03.30
            </div>
          </div>
        </div>

        {/* 戻るボタン */}
        <Link 
          href="/" 
          className="mt-12 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}