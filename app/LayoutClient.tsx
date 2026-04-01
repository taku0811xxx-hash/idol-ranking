"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import Footer from "@/app/components/Footer";

export default function LayoutClient({ children }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Header setIsOpen={setIsOpen} />
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <main className="pt-16">
    <div className="md:ml-56 max-w-7xl mx-auto px-4">
        {children}
    </div>
    </main>

      <Footer />
    </>
  );
}