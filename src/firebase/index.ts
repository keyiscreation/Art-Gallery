// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDORaE9FKlUqBmH5Tvwn_xOJ1fsuvcmF08",
  authDomain: "art-gallery-f4b4f.firebaseapp.com",
  projectId: "art-gallery-f4b4f",
  storageBucket: "art-gallery-f4b4f.firebasestorage.app",
  messagingSenderId: "587865501382",
  appId: "1:587865501382:web:62a455cfbea4cf9431f1c7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
