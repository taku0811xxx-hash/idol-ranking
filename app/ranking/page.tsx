"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { motion } from "framer-motion";

// 🔥 型の定義を追加してエラーを解消
interface IdolData {
  id: string;
  name?: string;
  image?: string;
  [key: string]: any; // その他のフィールドを許容
}

interface RankedIdol extends IdolData {
  voteCount: number;
  displayImage: string;
  displayName: string;
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankedIdol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const idolSnap = await getDocs(collection(db, "idols"));
        const idolsList = idolSnap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as IdolData[];

        const voteSnap = await getDocs(collection(db, "votes"));
        const counts: { [key: string]: number } = {};
        
        voteSnap.forEach((doc) => {
          const d = doc.data();
          const name = d.name;
          if (name) {
            counts[name] = (counts[name] || 0) + 1;
          }
        });

        const sorted: RankedIdol[] = idolsList
          .map(idol => ({
            ...idol,
            voteCount: counts[idol.name || ""] || 0,
            displayImage: idol.image || "https://placehold.jp/24/cccccc/ffffff/200x300.png?text=No%20Image",
            displayName: idol.name || "Unknown"
          }))
          .sort((a, b) => b.voteCount - a.voteCount);

        setRanking(sorted);
      } catch (error) {
        console.error("Error fetching ranking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  if (loading) {
    return <div className="py-20 text-center font-bold text-slate-400 uppercase tracking-widest">Ranking Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 mb-2 uppercase">
          OFFICIAL <span className="text-pink-500">RANKING</span>
        </h1>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest italic">Top Idols Leaderboard</p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-20 px-4">
        {ranking[1] && <TopThreeCard idol={ranking[1]} rank={2} color="bg-slate-300" size="w-32 md:w-44" />}
        {ranking[0] && <TopThreeCard idol={ranking[0]} rank={1} color="bg-yellow-400" size="w-40 md:w-56" isMain />}
        {ranking[2] && <TopThreeCard idol={ranking[2]} rank={3} color="bg-orange-400" size="w-28 md:w-40" />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ranking.slice(3, 50).map((idol, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            key={idol.id} 
            className="flex items-center bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all group"
          >
            <div className="w-12 font-black text-slate-200 text-2xl italic group-hover:text-pink-200 transition-colors">{i + 4}</div>
            <img 
              src={idol.displayImage} 
              referrerPolicy="no-referrer"
              className="w-20 h-20 object-cover rounded-2xl mr-5 bg-slate-100 shadow-inner" 
              alt={idol.displayName}
            />
            <div className="flex-1">
              <div className="font-black text-slate-800 text-lg line-clamp-1">{idol.displayName}</div>
              <div className="text-sm text-pink-500 font-bold tracking-tighter">
                {idol.voteCount.toLocaleString()} <span className="text-slate-400 text-[10px] uppercase">votes</span>
              </div>
            </div>
            <Link href={`/idol/${idol.id}`} className="ml-4 bg-slate-50 text-[10px] font-black text-slate-400 hover:bg-pink-500 hover:text-white px-5 py-3 rounded-xl transition-all tracking-widest uppercase">
              Detail
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TopThreeCard({ idol, rank, color, size, isMain }: { idol: RankedIdol, rank: number, color: string, size: string, isMain?: boolean }) {
  return (
    <Link href={`/idol/${idol.id}`} className={`relative group text-center ${isMain ? "z-20 scale-110" : "z-10 opacity-90 hover:opacity-100"}`}>
      <div className={`absolute -top-5 left-1/2 -translate-x-1/2 z-30 ${color} text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl font-black text-xl italic ring-4 ring-white`}>
        {rank}
      </div>
      <div className={`overflow-hidden rounded-[2.5rem] shadow-2xl border-4 ${isMain ? "border-yellow-400" : "border-white"} transition-all duration-500 group-hover:shadow-pink-200/50 group-hover:-translate-y-4 bg-slate-200`}>
        <img 
          src={idol.displayImage} 
          referrerPolicy="no-referrer"
          className={`${size} aspect-[2/3] object-cover`} 
          alt={idol.displayName}
        />
      </div>
      <div className="mt-6">
        <div className={`font-black ${isMain ? "text-2xl" : "text-lg"} text-slate-800 line-clamp-1 uppercase tracking-tighter italic`}>{idol.displayName}</div>
        <div className="bg-white/50 backdrop-blur-sm inline-block px-4 py-1 rounded-full mt-1 border border-slate-100 shadow-sm">
            <span className="text-pink-500 font-black text-sm">{idol.voteCount.toLocaleString()}</span>
            <span className="text-slate-400 text-[10px] font-bold uppercase ml-1">Votes</span>
        </div>
      </div>
    </Link>
  );
}