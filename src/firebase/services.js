import { db } from './config';
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import axios from 'axios';

// Firestore collection reference
const productsRef = collection(db, 'products');

export const getProducts = async () => {
  const q = query(productsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data(),
    // Map imageUrl to image if it exists to satisfy UI expectations if any
    image: doc.data().imageUrl || doc.data().image 
  }));
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
      name: productData.name,
      price: parseFloat(productData.price) || 0,
      weight: parseFloat(productData.weight) || 0,
      description: productData.description || '',
      category: productData.category || 'Limpieza',
      imageUrl: imageUrl || '',
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, imageUrl: imageUrl || '' };
  } catch (error) {
    console.error('Error adding document to Firestore:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData, imageFile) => {
  let imageUrl = productData.imageUrl || productData.image || '';

  if (imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      imageUrl = response.data.url;
    } catch (error) {
      console.error('Error uploading to B2:', error);
      throw error;
    }
  }

  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      name: productData.name,
      price: parseFloat(productData.price) || 0,
      weight: parseFloat(productData.weight) || 0,
      description: productData.description || '',
      category: productData.category || 'Limpieza',
      imageUrl: imageUrl || '',
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating document in Firestore:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document from Firestore:', error);
    throw error;
  }
};
