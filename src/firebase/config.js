import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVrqH9M9rGPUfyPDoFH3xnlxhuUjzTz40",
  authDomain: "jessiah-5e4ac.firebaseapp.com",
  projectId: "jessiah-5e4ac",
  storageBucket: "jessiah-5e4ac.firebasestorage.app",
  messagingSenderId: "449593806917",
  appId: "1:449593806917:web:7afdd5fca5d6157649132c",
  measurementId: "G-E9VVK44R8K"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
