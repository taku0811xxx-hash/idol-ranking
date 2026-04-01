"use client";

import { useState } from "react";
import SidebarContent from "./SidebarContent";

export default function Sidebar({ popularTags }: any) {
  const [showTags, setShowTags] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* PC */}
      <aside className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-56 bg-white border-r overflow-y-auto z-40">
        <SidebarContent
          showTags={showTags}
          setShowTags={setShowTags}
          popularTags={popularTags}
        />
      </aside>

      {/* スマホ */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-[80%] max-w-xs bg-white shadow-lg z-50 transform transition-transform ${
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

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 z-30"
        />
      )}
    </>
  );
}