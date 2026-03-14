import { db } from './config';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import axios from 'axios';

// Firestore collection reference
const productsRef = collection(db, 'products');

export const getProducts = async () => {
  const q = query(productsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addProduct = async (productData, imageFile) => {
  let imageUrl = productData.imageUrl || '';

  // If there's a file, upload to Backblaze B2 via our proxy
  if (imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      imageUrl = response.data.url;
    } catch (error) {
      console.error('Error uploading to B2:', error);
      throw error;
    }
  }

  // Save metadata to Firestore
  try {
    const docRef = await addDoc(productsRef, {
      ...productData,
      imageUrl,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, imageUrl };
  } catch (error) {
    console.error('Error adding document to Firestore:', error);
    throw error;
  }
};
