"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function SearchClient() {
  const params = useSearchParams();
  const q = params.get("q") || "";

  const [idols, setIdols] = useState<any[]>([]);
  const [allIdols, setAllIdols] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, "idols"));
      const list: any[] = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));

      setAllIdols(list);

      const filtered = list.filter((i) =>
        (i.name || "").toLowerCase().includes(q.toLowerCase())
      );

      setIdols(filtered);
    };

    fetch();
  }, [q]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-center">
        「{q}」の検索結果
      </h1>

      <p className="text-center text-gray-500 mb-6">
        {idols.length}件見つかりました
      </p>

      {/* 以下そのままでOK */}
    </div>
  );
}