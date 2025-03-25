// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Import Firestore functions
import { getStorage } from "firebase/storage";

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

// Initialize Firestore
export const db = getFirestore(app); // Firestore instance
export const auth = getAuth(app); // Authentication instance
export const storage = getStorage(app); // Storage instance

// Export Firestore methods that will be used in other components
export { collection, addDoc };
