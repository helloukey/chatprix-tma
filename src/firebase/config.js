// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "chatprix-tma-6c521.firebaseapp.com",
  projectId: "chatprix-tma-6c521",
  storageBucket: "chatprix-tma-6c521.firebasestorage.app",
  messagingSenderId: "775599992642",
  appId: "1:775599992642:web:a8e936c7d2cbdf9075e2db",
  measurementId: "G-T5X774VPXE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, db };
