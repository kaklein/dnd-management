// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3nk7-G4Oj-v0CMiGPs5Ag9P_rpSiaNzk",
  authDomain: "dnd-management-347a9.firebaseapp.com",
  projectId: "dnd-management-347a9",
  storageBucket: "dnd-management-347a9.appspot.com",
  messagingSenderId: "85440736047",
  appId: "1:85440736047:web:14d5dd595bb4971c258fda"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);