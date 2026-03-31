// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6Xb8CPVNhzhHGFOqjLzI_l0BE3-rVcP0",
  authDomain: "gravure-vote.firebaseapp.com",
  projectId: "gravure-vote",
  storageBucket: "gravure-vote.firebasestorage.app",
  messagingSenderId: "248443491334",
  appId: "1:248443491334:web:57260a6f60d85ba7879f87",
};

const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Storage
export const storage = getStorage(
  app,
  "gs://gravure-vote.firebasestorage.app"
);

// 🔥 これ追加（重要）
export const auth = getAuth(app);

// 🔥 upload
export const uploadImage = async (file) => {
  const storageRef = ref(storage, `idol-images/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};