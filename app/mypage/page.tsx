"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { motion } from "framer-motion";
import { User, Heart, ArrowLeft, Zap, ShieldCheck, ChevronRight } from "lucide-react";
import { playfair } from "../fonts";

export default function MyPage() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [votes, setVotes] = useState<any[]>([]);
  const [idols, setIdols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const userRef = doc(db, "users", u.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
        setUser(u);

        const voteQuery = query(
          collection(db, "votes"),
          where("userId", "==", u.uid)
        );
        const voteSnap = await getDocs(voteQuery);
        setVotes(voteSnap.docs.map((doc) => doc.data()));
      }

      const idolSnap = await getDocs(collection(db, "idols"));
      setIdols(idolSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() as any })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-black text-slate-200 text-4xl animate-pulse italic uppercase">
        Loading Profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-6 text-center">
        <ShieldCheck size={48} className="text-slate-200 mb-4" />
        <p className="font-black italic uppercase tracking-tighter text-slate-400 text-xl mb-6">Access Denied</p>
        <Link href="/login" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest shadow-xl">
          Please Login
        </Link>
      </div>
    );
  }

  return (
    <div className="md:ml-56 min-h-screen bg-[#F8FAFC] pt-24 pb-32 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-pink-500 transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {/* ■ プロフィールセクション */}
        <header className="relative">
          <div className="absolute -inset-4 bg-white rounded-[3rem] shadow-sm -z-10 border border-slate-100" />
          <div className="flex flex-col md:flex-row items-center gap-8 p-4">
            <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-pink-500 shadow-2xl rotate-3">
              <User size={40} strokeWidth={2.5} />
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 mb-1">Authenticated Member</p>
              <h1 className={`text-4xl font-black italic uppercase tracking-tighter text-slate-900 ${playfair.className}`}>
                {userData?.name || user.email?.split('@')[0]}
              </h1>
              <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">{user.email}</p>
            </div>
            <div className="md:ml-auto flex gap-4">
              <div className="bg-slate-50 px-6 py-4 rounded-2xl text-center border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Votes</p>
                <p className="text-xl font-black italic text-slate-900">{votes.length}</p>
              </div>
            </div>
          </div>
        </header>

        {/* ■ 投票履歴コレクション */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
              <Heart className="text-pink-500 fill-pink-500" size={24} /> My Collection
            </h2>
            <div className="h-[2px] flex-1 mx-6 bg-slate-100 hidden md:block" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{votes.length} Items</span>
          </div>

          {votes.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-200">
              <p className="font-black italic uppercase tracking-tighter text-slate-300 text-xl">No history yet</p>
              <Link href="/ranking" className="inline-block mt-6 text-pink-500 text-[10px] font-black uppercase tracking-widest hover:underline">
                Find your favorite idol →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {votes.map((v, i) => {
                const idol = idols.find((idolItem) => idolItem.id === v.idolId);
                if (!idol) return null;

                return (
                  <motion.div key={i} whileHover={{ y: -8 }}>
                    <Link href={`/idol/${idol.id}`} className="group block relative">
                      <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-white shadow-md border-4 border-white transition-all group-hover:shadow-2xl group-hover:shadow-pink-500/20">
                        <img
                          src={idol.image}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          alt={idol.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                          <p className="text-white text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">View Profile</p>
                          <ChevronRight className="text-white" size={20} />
                        </div>
                      </div>
                      <div className="mt-4 px-2 text-center">
                        <div className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Member</div>
                        <div className="text-sm font-black italic uppercase tracking-tighter text-slate-900 group-hover:text-pink-500 transition-colors">
                          {idol.name}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* ■ 下部アクション */}
        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row gap-6">
           <div className="flex-1 bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-xl">
              <Zap size={80} className="absolute -bottom-4 -right-4 text-white/5" />
              <h3 className="font-black italic uppercase tracking-tighter text-lg mb-2">Want to post?</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6 leading-relaxed">
                お気に入りのアイドルをまだ見つけていない？<br />
                新しいアイドルを登録して応援を始めましょう。
              </p>
              <Link href="/post" className="inline-block bg-white text-slate-900 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all">
                Post Now
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}