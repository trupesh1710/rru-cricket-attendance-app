import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbnTy0Du-BwYgQbbYkHaD4fsGaE4lsWbE",
  authDomain: "rru-cricket-attendance.firebaseapp.com",
  projectId: "rru-cricket-attendance",
  storageBucket: "rru-cricket-attendance.firebasestorage.app",
  messagingSenderId: "160406466590",
  appId: "1:160406466590:web:412e133828c63e6042be0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
