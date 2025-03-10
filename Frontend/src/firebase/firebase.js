import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD8eW5AQYdcLUnKp77R3GiajEludeKCggY",
    authDomain: "chatify-frontend.firebaseapp.com",
    projectId: "chatify-frontend",
    storageBucket: "chatify-frontend.firebasestorage.app",
    messagingSenderId: "106760665684",
    appId: "1:106760665684:web:fdede116c7d7f7a4470bc1",
    measurementId: "G-MRNGV5XZ68"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export {auth, db, googleProvider}