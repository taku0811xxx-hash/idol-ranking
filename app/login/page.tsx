"use client";

import { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, LogIn, UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async () => {
    if (!email || !password) return alert("メールアドレスとパスワードを入力してください");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (e: any) {
      alert("ログインに失敗しました: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
      {/* 背景の装飾（微かなアクセント） */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-pink-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-slate-900/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        {/* ロゴ・ヘッダー部分（文字を削除し、アイコンのみに） */}
        <div className="flex flex-col items-center mb-12">
          <div className="bg-slate-900 p-5 rounded-[2.2rem] shadow-2xl mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <ShieldCheck className="text-pink-500" size={40} />
          </div>
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400">Welcome Back</h2>
        </div>

        {/* ログインカード */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8 relative overflow-hidden">
          <div className="space-y-5">
            <div className="relative">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1.5 block tracking-widest">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-500 transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-800 focus:ring-2 focus:ring-pink-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1.5 block tracking-widest">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-500 transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-800 focus:ring-2 focus:ring-pink-500 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl hover:bg-pink-500 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? "AUTHENTICATING..." : <><LogIn size={18} /> Sign In</>}
          </button>

          <div className="pt-2 flex flex-col items-center gap-4">
            <Link 
              href="/register" 
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-pink-500 transition-colors flex items-center gap-2"
            >
              <UserPlus size={14} /> 新規登録はこちら
            </Link>
          </div>
        </div>

        {/* 下部ナビゲーション */}
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