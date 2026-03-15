import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

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
const db = getFirestore(app);

async function updateWeights() {
  console.log("Updating product weights to 0.5 lb...");
  const querySnapshot = await getDocs(collection(db, "products"));
  let count = 0;
  for (const docSnapshot of querySnapshot.docs) {
    const productRef = doc(db, "products", docSnapshot.id);
    await updateDoc(productRef, { weight: 0.5 });
    count++;
  }
  console.log(`Successfully updated ${count} products.`);
  process.exit(0);
}

updateWeights().catch(err => {
  console.error(err);
  process.exit(1);
});
