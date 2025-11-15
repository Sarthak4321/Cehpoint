// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAhfLuDzPGzljV8DkUOJOTvmY3D6-k0C7U",
//   authDomain: "cehpoint-5a5e1.firebaseapp.com",
//   projectId: "cehpoint-5a5e1",
//   storageBucket: "cehpoint-5a5e1.firebasestorage.app",
//   messagingSenderId: "832098629268",
//   appId: "1:832098629268:web:a803ecfad5135652256681"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);






import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Prevent initializing Firebase more than once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export Firebase Auth instance
export const auth = getAuth(app);
