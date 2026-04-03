"use client";

import { useState } from "react";
import { Mail, Send, MessageSquare, Zap, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "contacts"), {
        name: form.name,
        email: form.email,
        message: form.message,
        createdAt: serverTimestamp(),
      });

      alert("メッセージを送信しました。お問い合わせありがとうございます。");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      alert("送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="md:ml-56 flex flex-col min-h-screen bg-[#F8FAFC]">
      <main className="flex-1 pt-24 pb-32 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* ヘッダー */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-slate-900 text-pink-500 p-3 rounded-2xl shadow-xl rotate-3">
                <Mail size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                  Get in <span className="text-pink-500">Touch</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">Support Desk</p>
              </div>
            </div>
            <div className="h-1 w-20 bg-slate-900 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* 左側：案内テキスト */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <Zap size={120} className="absolute -bottom-10 -right-10 text-white/5" />
                
                <h2 className="text-xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-2">
                  <MessageSquare size={20} className="text-pink-500" /> Message Us
                </h2>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                  サイトへの掲載依頼、データの修正、不具合報告、またはビジネスに関するご相談はこちらから承ります。通常、1〜2営業日以内に担当よりご連絡いたします。
                </p>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <ShieldCheck className="text-pink-500" size={20} />
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Privacy First</div>
                    <div className="text-[11px] font-bold">情報は安全に送信されます</div>
                  </div>
                </div>
              </div>

              <div className="px-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-loose italic">
                  ※ 全てのフィールドは入力必須です。<br />
                  ※ 内容によっては回答を差し控えさせていただく場合がございます。
                </p>
              </div>
            </div>

            {/* 右側：フォーム本体 */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-10 md:p-12 shadow-sm border border-slate-100 space-y-8">
                
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2 italic">Your Name</label>
                    <input
                      type="text"
                      placeholder="お名前を入力してください"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all placeholder:text-slate-300"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2 italic">Email Address</label>
                    <input
                      type="email"
                      placeholder="example@mail.com"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all placeholder:text-slate-300"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2 italic">Message Content</label>
                    <textarea
                      placeholder="お問い合わせ内容を入力してください"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all placeholder:text-slate-300 h-40 resize-none"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase italic tracking-[0.2em] shadow-2xl hover:bg-pink-500 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden"
                >
                  <span className="relative z-10">{isSubmitting ? "Sending..." : "Send Message"}</span>
                  {!isSubmitting && <Send size={18} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

              </form>

              <Link 
                href="/" 
                className="mt-12 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                Back to Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}