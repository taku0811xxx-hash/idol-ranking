"use client";

import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import Footer from "@/app/components/Footer";
import { useState } from "react";

export default function LayoutClient({ children }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen"> {/* 👈 全体の背景を白に固定 */}
      <Header setIsOpen={setIsOpen} />

      <div className="flex items-start bg-white"> {/* 👈 ここにも bg-white を追加 */}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <main className="flex-1 min-h-screen bg-[#fafbfc] pt-20 md:pt-24 px-6">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}