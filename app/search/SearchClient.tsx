"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowLeft, ChevronRight, Zap } from "lucide-react";
import { playfair } from "../fonts"; // fonts.tsxのパスに合わせて調整してください

export default function SearchClient() {
  const params = useSearchParams();
  const q = params.get("q") || "";

  const [idols, setIdols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdols = async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, "idols"));
      const list: any[] = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));

      const filtered = list.filter((i) =>
        (i.name || "").toLowerCase().includes(q.toLowerCase())
      );

      setIdols(filtered);
      setLoading(false);
    };

    fetchIdols();
  }, [q]);

  if (loading) {
    return (
      <div className="md:ml-56 min-h-screen flex items-center justify-center bg-white font-black text-slate-200 text-4xl animate-pulse italic uppercase">
        Searching...
      </div>
    );
  }

  return (
    <div className="md:ml-56 min-h-screen bg-[#F8FAFC] pt-24 pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-pink-500 transition-colors mb-12">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {/* 検索ヘッダー */}
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-slate-900 text-pink-500 p-3 rounded-2xl shadow-xl -rotate-3">
              <Search size={32} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Search Results</p>
              <h1 className={`text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900 leading-none ${playfair.className}`}>
                &ldquo;{q}&rdquo;
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-1 w-20 bg-pink-500 rounded-full" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {idols.length} <span className="italic">Members Found</span>
            </p>
          </div>
        </header>

        {/* 結果一覧 */}
        {idols.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-200">
            <Zap size={48} className="mx-auto text-slate-200 mb-6" />
            <p className="font-black italic uppercase tracking-tighter text-slate-300 text-2xl">No Match Found</p>
            <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest italic">別のキーワードで試してみてください</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {idols.map((idol, index) => (
              <motion.div
                key={idol.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/idol/${idol.id}`} className="group block">
                  <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-white shadow-lg border-4 border-white transition-all group-hover:shadow-2xl group-hover:shadow-pink-500/20 group-hover:-translate-y-2">
                    <img
                      src={idol.image}
                      alt={idol.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                      <div className="flex items-center justify-between text-white">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">View Details</p>
                          <p className="text-lg font-black italic uppercase tracking-tighter leading-none">{idol.name}</p>
                        </div>
                        <ChevronRight size={24} className="text-pink-500" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 px-4">
                    <div className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] mb-1">Database ID: {idol.id.slice(0, 5)}</div>
                    <div className="text-sm font-black italic uppercase tracking-tighter text-slate-900 group-hover:text-pink-500 transition-colors">
                      {idol.name}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}