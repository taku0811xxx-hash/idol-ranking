"use client";

import { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, ArrowLeft, LogIn } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const register = async () => {
    if (!email || !name || !password) return alert("すべての項目を入力してください");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: name,
        createdAt: serverTimestamp(),
      });

      alert("登録が完了しました！");
      router.push("/");
    } catch (e: any) {
      alert("登録に失敗しました: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
      {/* 背景の装飾 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-pink-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-slate-900/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        {/* ヘッダー部分 */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-slate-900 p-5 rounded-[2.2rem] shadow-2xl mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <UserPlus className="text-pink-500" size={40} />
          </div>
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400">Join Community</h2>
        </div>

        {/* 登録カード */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-7 relative overflow-hidden">
          <div className="space-y-4">
            {/* Name Input */}
            <div className="relative group">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1.5 block tracking-widest">User Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-800 focus:ring-2 focus:ring-pink-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="relative group">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1.5 block tracking-widest">Email Address</label>
              <div className="relative">
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

            {/* Password Input */}
            <div className="relative group">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1.5 block tracking-widest">Password</label>
              <div className="relative">
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
            onClick={register}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl hover:bg-pink-500 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? "CREATING ACCOUNT..." : <><UserPlus size={18} /> Create Account</>}
          </button>

          <div className="pt-2 flex flex-col items-center gap-4">
            <Link 
              href="/login" 
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-pink-500 transition-colors flex items-center gap-2"
            >
              <LogIn size={14} /> ログインはこちら
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