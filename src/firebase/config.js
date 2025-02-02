// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "chatprix-tma.firebaseapp.com",
  projectId: "chatprix-tma",
  storageBucket: "chatprix-tma.firebasestorage.app",
  messagingSenderId: "139032993045",
  appId: "1:139032993045:web:4908f55dc7ddb7c37c1d1c",
  measurementId: "G-84V4PMWBHF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, db };
