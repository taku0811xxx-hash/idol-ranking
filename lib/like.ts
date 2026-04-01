import { doc, setDoc, deleteDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { collection, query, where, getCountFromServer } from "firebase/firestore";

// 🔥 いいねトグル（押すたびにON/OFF）
export async function toggleLike(postId: string) {
  const user = auth.currentUser;
  if (!user) {
    alert("ログインしてください");
    return;
  }

  const likeId = `${postId}_${user.uid}`;
  const ref = doc(db, "post_likes", likeId);

  const snap = await getDoc(ref);

  // すでにいいねしてる → 削除
  if (snap.exists()) {
    await deleteDoc(ref);
    return false;
  }

  // まだいいねしてない → 作成
  await setDoc(ref, {
    postId,
    userId: user.uid,
    createdAt: serverTimestamp(),
  });

  return true;
}

// いいね数取得
export async function getLikeCount(postId: string) {
  const q = query(
    collection(db, "post_likes"),
    where("postId", "==", postId)
  );

  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

// 🔥 初期状態チェック（これ超重要）
export async function checkLiked(postId: string) {
  const user = auth.currentUser;
  if (!user) return false;

  const likeId = `${postId}_${user.uid}`;
  const ref = doc(db, "post_likes", likeId);

  const snap = await getDoc(ref);
  return snap.exists();
}