// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "car-marketplace-e007.firebaseapp.com",
  projectId: "car-marketplace-e007",
  storageBucket: "car-marketplace-e007.firebasestorage.app",
  messagingSenderId: "281275029301",
  appId: "1:281275029301:web:866823370cef1324a01e7c",
  measurementId: "G-QHG9MD28EF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const storage = getStorage(app);