// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBe-QnbJQiYglB0GVI0EXW5L6TM9XR0ao0",
  authDomain: "mini-store-1a68d.firebaseapp.com",
  projectId: "mini-store-1a68d",
  storageBucket: "mini-store-1a68d.appspot.com", // can keep, but unused
  messagingSenderId: "755873124493",
  appId: "1:755873124493:web:968cb599bf0d4efdee92c4",
  measurementId: "G-9M1K6FW026",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const db = getFirestore(app);
const auth = getAuth(app);

// Export
export { db, auth };
