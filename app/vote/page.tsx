"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/firebase";
import { collection, getDocs, addDoc, serverTimestamp, doc, updateDoc, increment, query, where, orderBy, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, CheckCircle2, Lock } from "lucide-react";

export default function VotePage() {
  const [idols, setIdols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedId, setVotedId] = useState<string | null>(null);
  const [canVote, setCanVote] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkVoteStatus = async (currentUser: any) => {
      // 1. まずブラウザ（LocalStorage）をチェック
      const lastVote = localStorage.getItem("last_vote_time");
      if (lastVote) {
        const diff = (Date.now() - parseInt(lastVote)) / (1000 * 60 * 60);
        if (diff < 24) {
          setCanVote(false);
          return;
        }
      }

      // 2. ログインしている場合は、DBからも最終投票を確認（より厳密なチェック）
      if (currentUser) {
        const q = query(
          collection(db, "votes"),
          where("userId", "==", currentUser.uid),
          orderBy("timestamp", "desc"),
          limit(1)
        );
        const voteSnap = await getDocs(q);
        if (!voteSnap.empty) {
          const lastVoteData = voteSnap.docs[0].data();
          if (lastVoteData.timestamp) {
            const diff = (Date.now() - lastVoteData.timestamp.toDate().getTime()) / (1000 * 60 * 60);
            if (diff < 24) {
              setCanVote(false);
            }
          }
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      checkVoteStatus(currentUser);
      
      // アイドル一覧の取得
      getDocs(collection(db, "idols")).then((snapshot) => {
        setIdols(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });
    });

    return () => unsubscribe();
  }, []);

  const handleVote = async (idol: any) => {
    if (!canVote) return;

    try {
      // 投票データの作成
      const voteData: any = {
        idolId: idol.id,
        name: idol.name,
        timestamp: serverTimestamp(),
      };
      
      // ログインしていればIDを紐付け（していなくても投票可）
      if (user) {
        voteData.userId = user.uid;
      } else {
        voteData.userId = "anonymous";
      }

      await addDoc(collection(db, "votes"), voteData);

      const idolRef = doc(db, "idols", idol.id);
      await updateDoc(idolRef, {
        count: increment(1)
      });

      // 成功処理
      setVotedId(idol.id);
      setCanVote(false);
      
      // ブラウザに投票時間を保存
      localStorage.setItem("last_vote_time", Date.now().toString());

      setIdols(prev => prev.map(item => 
        item.id === idol.id ? { ...item, count: (item.count || 0) + 1 } : item
      ));

    } catch (error) {
      console.error("Vote error:", error);
    }
  };

  if (loading) return <div className="py-20 text-center font-black text-slate-400">LOADING...</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 mb-2 uppercase">
          Daily <span className="text-pink-500">Election</span>
        </h1>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest italic">
          {canVote ? "1日1回、あなたの1票が順位を決める" : "本日の投票は完了しました。また明日！"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {idols.map((idol) => (
          <motion.div
            key={idol.id}
            className="bg-white rounded-[2.5rem] p-3 shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative"
          >
            <AnimatePresence>
              {votedId === idol.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-20 bg-pink-500/90 rounded-[2.5rem] flex flex-col items-center justify-center text-white"
                >
                  <CheckCircle2 size={48} className="mb-2" />
                  <span className="font-black italic text-xl uppercase">Voted!</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-slate-100 mb-4">
              <img
                src={idol.image || idol.imageURL || "https://placehold.jp/24/cccccc/ffffff/200x300.png?text=No%20Image"}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt={idol.name}
              />
            </div>

            <div className="px-2 pb-2 text-center">
              <h3 className="font-black text-slate-800 mb-4 truncate uppercase italic tracking-tighter">
                {idol.name}
              </h3>
              
              <button
                onClick={() => handleVote(idol)}
                disabled={!canVote}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  !canVote 
                    ? "bg-slate-100 text-slate-400" 
                    : "bg-slate-900 text-white hover:bg-pink-500 shadow-md active:scale-95"
                }`}
              >
                {canVote ? "Vote" : <span className="flex items-center justify-center gap-2">Voted</span>}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}