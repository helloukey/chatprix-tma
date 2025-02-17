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
  authDomain: "chatprix-tma-dcdd6.firebaseapp.com",
  projectId: "chatprix-tma-dcdd6",
  storageBucket: "chatprix-tma-dcdd6.firebasestorage.app",
  messagingSenderId: "492422120216",
  appId: "1:492422120216:web:fcd97025f4197c8ef6146d",
  measurementId: "G-C3TWGMJPG6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, db };
