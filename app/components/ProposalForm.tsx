"use client";

import { useState } from "react";
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ProposalForm({ idolId }: { idolId: string }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!text) return;

    await addDoc(collection(db, "proposals"), {
      idolId,
      type: "appeal",
      content: text,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    setText("");
    setOpen(false);
    alert("提案を送信しました");
  };

  return (
    <div className="mt-6">
      <button
            onClick={() => setOpen(!open)}
            className="text-sm text-blue-500 underline cursor-pointer"
            >
            {open ? "閉じる" : "この文章を改善する"}
            </button>

      {open && (
        <div className="mt-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border p-2 rounded"
            rows={4}
          />

          <button
            onClick={handleSubmit}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            提案する
          </button>
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 border rounded"
        >
            キャンセル
            </button>
        </div>
      )}
    </div>
  );
}