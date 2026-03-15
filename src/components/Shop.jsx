import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';
import { MousePointer2, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { getProducts } from '../firebase/services';

const Shop = ({ onBack, onAddToCart, t, catT }) => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState(catT.all);
  const [isLoading, setIsLoading] = useState(true);
  
  const categories = [catT.all, catT.cleaning, catT.hydration, catT.treatment, catT.finish, catT.nutrition];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products from Firestore:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = filter === catT.all 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="shop-page">
      <section className="page-hero shop-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t.title} <em>{t.title_em}</em>
          </motion.h1>
          <p className="subtitle">{t.subtitle}</p>
        </div>
      </section>

      <div className="shop-controls container">
        <div className="filters-row">
          <div className="filter-label">
            <SlidersHorizontal size={18} />
            <span>{t.filter}</span>
          </div>
          <div className="filter-options">
            {categories.map(cat => (
              <button 
                key={cat}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="results-count">
          {t.showing} {filteredProducts.length} {t.products}
        </div>
      </div>

      <main className="shop-grid-container container">
        {isLoading ? (
          <div className="loader">{t.loading}</div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
                t={t}
                catT={catT}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>{t.no_results}</p>
            <button className="btn-gold" onClick={() => setFilter(catT.all)}>{t.view_all}</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Shop;
