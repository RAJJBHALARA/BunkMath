import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbclXQif4AoUjjQFFWEucaq4OQ-UNkBvE",
  authDomain: "bunkmath.firebaseapp.com",
  projectId: "bunkmath",
  storageBucket: "bunkmath.firebasestorage.app",
  messagingSenderId: "145831573921",
  appId: "1:145831573921:web:67f1b9250676c2c18c73e0",
  measurementId: "G-FLCN82WC5B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
