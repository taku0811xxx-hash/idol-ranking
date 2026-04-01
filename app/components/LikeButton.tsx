"use client";

import { useState, useEffect } from "react";
import { toggleLike, checkLiked, getLikeCount } from "@/lib/like";

export default function LikeButton({
  postId,
  externalTrigger,
}: {
  postId: string;
  externalTrigger?: number;
}) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const likedResult = await checkLiked(postId);
      const countResult = await getLikeCount(postId);

      setLiked(likedResult);
      setCount(countResult);
      setLoading(false);
    };
    fetch();
  }, [postId]);

  const handleLike = async () => {
  const result = await toggleLike(postId);
  if (result === undefined) return;

  setLiked(result);

  const newCount = await getLikeCount(postId);
  setCount(newCount);

  setAnimate(true);
  setTimeout(() => setAnimate(false), 300);
};

  // 🔥 外部トリガー（これ1つだけ）
  useEffect(() => {
    if (externalTrigger === undefined) return;
    handleLike();
  }, [externalTrigger]);

  if (loading) return null;

  return (
    <div className="flex flex-col items-center mt-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleLike();
        }}
        className={`text-xl cursor-pointer transition transform ${
          animate ? "scale-125 rotate-12" : "scale-100"
        }`}
      >
        {liked ? "❤️" : "🤍"}
      </button>

      <span className="text-xs text-gray-500">{count}</span>
    </div>
  );
}