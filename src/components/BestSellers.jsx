import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getProducts } from '../firebase/services';
import ProductCard from './ProductCard';

const BestSellers = ({ onAddToCart, t, catT }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          setProducts(data.slice(0, 4));
        } else {
          console.warn("No products found in Firestore.");
        }
      } catch (error) {
        console.error("Error connecting to Firestore:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return null;

  return (
    <section className="best-sellers">
      <div className="container">
        <motion.h2 
          className="section-title text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          {t.title} <em>{t.title_em}</em>
        </motion.h2>

        <div className="best-sellers-grid">
          {products.map((product, idx) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
              t={t}
              catT={catT}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
