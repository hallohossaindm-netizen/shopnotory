// firebase-config.js
// ShopnoTory E-commerce - Firebase Configuration & Initialization
// Firebase SDK Version: 10.13.1 (ES Modules)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// আপনার প্রদত্ত Firebase কনফিগারেশন
export const firebaseConfig = {
  apiKey: "AIzaSyDbvT4rjl12eUSmKTao0KcN6NJH9YIUy6Y",
  authDomain: "shopnotory13.firebaseapp.com",
  projectId: "shopnotory13",
  storageBucket: "shopnotory13.firebasestorage.app",
  messagingSenderId: "27958213094",
  appId: "1:27958213094:web:f7458c0e5b9a3f3cad3e27",
  measurementId: "G-WGXRPDEXPV"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export Auth & Firestore Utilities
export {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  collection,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
};
