"use client";

import { useState, useEffect } from "react";
import SidebarContent from "./SidebarContent";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Sidebar({ isOpen, setIsOpen }: any) {
  const [showTags, setShowTags] = useState(false);
  const [popularTags, setPopularTags] = useState<any[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const snap = await getDocs(collection(db, "tags"));

      const list: any[] = [];
      snap.forEach((doc) => {
        list.push({ name: doc.id, ...doc.data() });
      });

      list.sort((a, b) => (b.count || 0) - (a.count || 0));
      setPopularTags(list);
    };

    fetchTags();
  }, []);

  return (
    <>
      {/* PC（元のまま） */}
      <aside className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-56 bg-white border-r overflow-y-auto z-40">
        <SidebarContent
          showTags={showTags}
          setShowTags={setShowTags}
          popularTags={popularTags}
        />
      </aside>

      {/* スマホ（元のまま＋isOpen連携） */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-[80%] max-w-xs bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="p-4 text-lg"
        >
          ✕
        </button>

        <SidebarContent
          showTags={showTags}
          setShowTags={setShowTags}
          popularTags={popularTags}
        />
      </div>

      {/* 背景（元のまま） */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 z-30"
        />
      )}
    </>
  );
}