"use client";

import { useState, useMemo } from "react";
import SidebarContent from "./SidebarContent";
import data from "@/data.json";

export default function Sidebar({ isOpen, setIsOpen }: any) {
  const [showTags, setShowTags] = useState(false);

  const popularTags = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((idol: any) => {
      const tags = Array.isArray(idol.tags) ? idol.tags : (idol.tags?.split(",") || []);
      tags.forEach((tag: string) => {
        const t = tag.trim();
        if (t) counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  return (
    <>
      {/* PC用 */}
      <aside className="hidden md:block w-64 bg-white border-r border-slate-200 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto z-30">
        <SidebarContent showTags={showTags} setShowTags={setShowTags} popularTags={popularTags} />
      </aside>

      {/* スマホ用（修正：h-full と overflow-y-auto を追加） */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-[280px] bg-white shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ヘッダー部分（固定） */}
        <div className="flex justify-between items-center p-5 border-b border-slate-50">
          <span className="font-black text-xs text-slate-400 tracking-widest uppercase">Navigation</span>
          <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-900">✕</button>
        </div>

        {/* コンテンツ部分（ここをスクロール可能にする） */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <SidebarContent showTags={showTags} setShowTags={setShowTags} popularTags={popularTags} />
        </div>
      </div>

      {/* オーバーレイ */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] md:hidden" />
      )}
    </>
  );
}