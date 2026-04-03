"use client";

import { useState } from "react";
import { db, uploadImage } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, User, Upload, CheckCircle, FileUp, Clock, X } from "lucide-react";

export default function PostPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 以前のプレビューURLがあればメモリ解放
      if (preview) URL.revokeObjectURL(preview);
      
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🌟 プレビュー画像を削除する関数
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素のクリックイベント（ファイル選択）を防止
    if (preview) URL.revokeObjectURL(preview);
    setImageFile(null);
    setPreview(null);
    // inputの値をリセット（同じファイルを再度選択できるようにするため）
    const input = document.getElementById("file-input") as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageFile) {
      alert("名前と画像は必須です！");
      return;
    }

    setUploading(true);
    try {
      const downloadURL = await uploadImage(imageFile);

      await addDoc(collection(db, "pending_idols"), {
        name: name,
        imageUrl: downloadURL,
        createdAt: serverTimestamp(),
        status: "pending"
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("Upload error:", error);
      alert("投稿に失敗しました。");
    } finally {
      setUploading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <div className="relative mb-6">
            <CheckCircle size={80} className="text-pink-500" />
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2 text-yellow-400"
            >
              <Clock size={32} />
            </motion.div>
          </div>
        </motion.div>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Application Received!</h2>
        <p className="text-slate-500 mt-4 font-bold max-w-md mx-auto">
          運営による承認後、ランキングに反映されます。
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 mb-2 uppercase">
          New <span className="text-pink-500">Idol</span> Request
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="flex flex-col md:flex-row items-stretch gap-8 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 relative">
            <div className="absolute -top-4 -left-4 bg-slate-900 text-white p-4 rounded-full shadow-lg">
                <FileUp size={20} />
            </div>

            {/* 1. 画像アップロードエリア */}
            <div className="w-full md:w-1/3 flex-shrink-0">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">1. Photo</label>
              <div 
                onClick={() => document.getElementById("file-input")?.click()}
                className="relative w-full aspect-square rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-pink-300 transition-all group mt-2"
              >
                <AnimatePresence mode="wait">
                  {preview ? (
                    <motion.div 
                      key="preview"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="relative w-full h-full"
                    >
                      <img src={preview} className="w-full h-full object-cover" alt="preview" />
                      
                      {/* 🌟 削除ボタン */}
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-3 right-3 p-2 bg-slate-900/80 text-white rounded-full hover:bg-pink-500 transition-colors z-20 backdrop-blur-sm"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="placeholder"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="text-center p-4"
                    >
                      <div className="bg-white p-3 rounded-full shadow-sm mb-3 inline-block group-hover:scale-110 transition-transform border border-slate-100">
                        <ImagePlus className="text-slate-300" size={24} />
                      </div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">Click to Upload</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <input id="file-input" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
            </div>

            {/* 2. 名前入力 */}
            <div className="flex-1 space-y-2 self-center">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">2. Idol Name</label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><User size={18} /></div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ENTER NAME"
                  className="w-full bg-slate-50 border-none rounded-2xl py-6 pl-14 pr-6 font-black text-slate-800 placeholder:text-slate-200 focus:ring-2 focus:ring-pink-500 transition-all uppercase italic text-lg"
                  required
                />
              </div>
            </div>
        </div>

        <div className="max-w-xl mx-auto">
            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 ${
                uploading ? "bg-slate-200 text-slate-400" : "bg-slate-900 text-white hover:bg-pink-500 hover:-translate-y-1"
              }`}
            >
              {uploading ? "Sending Request..." : <><Upload size={18} /> Send Request</>}
            </button>
        </div>
      </form>
    </div>
  );
}