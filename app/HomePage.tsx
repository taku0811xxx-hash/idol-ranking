"use client";

import { useEffect, useState } from "react";
import { Trophy, ArrowRight, Flame, Sparkles, ImagePlus, Star, Home, Search, X } from "lucide-react";
import { db, auth } from "../firebase";
import Link from "next/link";
import { 
    collection, 
    getDocs, 
    query, 
    orderBy, 
    limit, 
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import { playfair, noto } from "./fonts";

export default function HomePage() {
    const [ranking, setRanking] = useState<any[]>([]);
    const [popularTags, setPopularTags] = useState<any[]>([]);
    const [newPosts, setNewPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        const fetchData = async () => {
            try {
                const idolSnap = await getDocs(collection(db, "idols"));
                const idolsList = idolSnap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

                const voteSnap = await getDocs(collection(db, "votes"));
                const counts: { [key: string]: number } = {};
                voteSnap.forEach((doc) => {
                    const d = doc.data();
                    if (d.name) counts[d.name] = (counts[d.name] || 0) + 1;
                });

                const sortedRanking = [...idolsList]
                    .map(idol => ({
                        ...idol,
                        voteCount: counts[idol.name] || 0,
                        displayImage: idol.image || "https://placehold.jp/200x300.png"
                    }))
                    .sort((a, b) => b.voteCount - a.voteCount)
                    .slice(0, 3);
                setRanking(sortedRanking);

                const tagMap: { [key: string]: number } = {};
                idolsList.forEach(idol => {
                    if (idol.tags && Array.isArray(idol.tags)) {
                        idol.tags.forEach((tag: string) => {
                            tagMap[tag] = (tagMap[tag] || 0) + 1;
                        });
                    }
                });
                setPopularTags(Object.entries(tagMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 12));

                const q = query(collection(db, "idols"), orderBy("createdAt", "desc"), limit(20));
                const newIdolsSnap = await getDocs(q);
                const rawNewPosts = newIdolsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

                const priorityPosts = rawNewPosts.sort((a, b) => {
                    const aIsUser = a.image && !a.image.includes("placehold.jp") ? 1 : 0;
                    const bIsUser = b.image && !b.image.includes("placehold.jp") ? 1 : 0;
                    return bIsUser - aIsUser;
                }).slice(0, 12);

                setNewPosts(priorityPosts);

            } catch (e) {
                console.error("Fetch error:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        return () => unsubscribeAuth();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white font-black text-slate-200 text-4xl animate-pulse italic uppercase">Loading...</div>;

    return (
        <main className={`flex-1 pb-20 bg-white ${noto.className}`}>
            {/* 1. HERO SECTION */}
            <div className="relative pt-32 pb-24 flex items-center justify-center overflow-hidden bg-slate-900 mb-10 rounded-b-[4rem] shadow-2xl">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-pink-500/20 blur-[120px] rounded-full animate-pulse"></div>
                <div className="relative z-10 text-center px-4">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className={`text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter italic uppercase ${playfair.className}`}>
                            IDOL <span className="text-pink-500">Rank</span>
                        </h1>
                        <p className="text-gray-400 text-sm md:text-lg max-w-xl mx-auto leading-relaxed font-bold uppercase tracking-[0.3em] mb-10">
                            Your Vote, Their Future.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/vote">
                                <button className="bg-pink-500 text-white px-10 py-5 rounded-full font-black uppercase italic shadow-lg shadow-pink-500/40 hover:bg-pink-400 hover:-translate-y-1 transition-all">Vote Now</button>
                            </Link>
                            <Link href="/post">
                                <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-full font-black uppercase italic tracking-widest hover:bg-white/20 transition-all flex items-center gap-2">
                                    <ImagePlus size={20} /> Post Idol
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 space-y-24">
                {/* 2. TOP LEADERS (即座に詳細ページへ) */}
                <section>
                    <div className="flex items-center justify-between mb-10 px-2">
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                            <Trophy className="text-yellow-400" size={32} /> Top Leaders
                        </h2>
                        <Link href="/ranking" className="group text-sm font-black text-pink-500 flex items-center gap-2 hover:bg-pink-50 px-5 py-3 rounded-full transition-all uppercase">
                            View Full List <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {ranking.map((idol, i) => (
                            <Link key={idol.id} href={`/idol/${idol.id}`}>
                                <motion.div whileHover={{ y: -10 }} className="bg-white rounded-[3rem] p-4 shadow-sm border border-slate-100 hover:shadow-2xl transition-all group relative overflow-hidden">
                                    <div className={`absolute top-6 right-6 z-10 w-12 h-12 rounded-full flex items-center justify-center font-black italic shadow-lg ring-4 ring-white ${i === 0 ? "bg-yellow-400 text-white" : "bg-slate-900 text-white"}`}>#{i + 1}</div>
                                    <img src={idol.displayImage} referrerPolicy="no-referrer" className="w-full aspect-[3/4] object-cover rounded-[2.5rem] group-hover:scale-110 transition-transform duration-700" alt={idol.name} />
                                    <div className="mt-6 pb-2 text-center">
                                        <h3 className="font-black text-slate-800 text-2xl uppercase italic tracking-tighter">{idol.name}</h3>
                                        <div className="inline-block mt-2 px-4 py-1 bg-pink-50 rounded-full">
                                            <p className="text-pink-500 font-black text-xs uppercase tracking-tighter">{idol.voteCount.toLocaleString()} VOTES</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 3. NEW ARRIVALS (即座に詳細ページへ) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start pb-10">
                    <section 
                        className="lg:col-span-2 bg-slate-50 rounded-[4rem] p-10 overflow-hidden relative border border-slate-100"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div className="flex items-center justify-between mb-10 px-2 relative z-10">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                                <Sparkles className="text-pink-500 fill-pink-500" /> New Arrivals
                            </h2>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm">User Uploads First</span>
                        </div>

                        <div className="relative w-full overflow-hidden">
                            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
                            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

                            <div 
                                className="flex gap-5 w-max animate-scroll-infinite"
                                style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
                            >
                                {[...newPosts, ...newPosts].map((post, i) => (
                                    <Link key={`${post.id}-${i}`} href={`/idol/${post.id}`} className="block shrink-0">
                                        <motion.div 
                                            className="w-[180px] aspect-[3/4] rounded-3xl overflow-hidden bg-white shadow-md relative border-4 border-white"
                                            whileHover={{ y: -15, scale: 1.05, boxShadow: "0 25px 50px -12px rgba(236, 72, 153, 0.4)" }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        >
                                            <img src={post.image || "https://placehold.jp/200x300.png"} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt={post.name} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent flex flex-col justify-end p-5 transition-opacity duration-300">
                                                <p className="text-white text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Latest Post</p>
                                                <p className="text-white text-sm font-black italic truncate uppercase tracking-tighter">{post.name}</p>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-[4rem] p-10 border border-slate-100 shadow-sm">
                        <h2 className="text-2xl font-black italic uppercase mb-8 flex items-center gap-3">
                            <Flame className="text-orange-500 fill-orange-500" /> Popular Tags
                        </h2>
                        <div className="flex flex-wrap gap-2 mb-10">
                            {popularTags.map(tag => (
                                <Link key={tag.name} href={`/tag/${encodeURIComponent(tag.name)}`} className="px-5 py-3 bg-slate-50 rounded-2xl text-[11px] font-black text-slate-500 hover:bg-slate-900 hover:text-white transition-all border border-slate-100 uppercase">
                                    #{tag.name}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-10 p-8 bg-slate-900 rounded-[3rem] text-white text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 blur-3xl rounded-full"></div>
                            <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-pink-500">Join Us</p>
                            <h4 className="relative z-10 font-black italic text-xl mb-6 leading-tight uppercase">Share Your<br/>Favorite</h4>
                            <Link href="/post" className="relative z-10 inline-block bg-white text-slate-900 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all shadow-xl">Post Now</Link>
                        </div>
                    </section>
                </div>
            </div>

            <style jsx global>{`
                @keyframes scrollInfinite {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .animate-scroll-infinite {
                    animation: scrollInfinite 40s linear infinite;
                }
            `}</style>
        </main>
    );
}