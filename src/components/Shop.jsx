import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';
import { MousePointer2, SlidersHorizontal, ArrowLeft } from 'lucide-react';

const Shop = ({ onBack, onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('Todos');
  const [isLoading, setIsLoading] = useState(true);
  
  const categories = ['Todos', 'Limpieza', 'Hidratación', 'Tratamiento', 'Acabado', 'Nutrición'];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = filter === 'Todos' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="shop-page">
      <header className="page-header shop-header">
        <div className="container">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
            <span>Volver Inicio</span>
          </button>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Nuestra <em>Colección</em>
          </motion.h1>
          <p className="subtitle">Lujo y ciencia aplicada a tu cabello</p>
        </div>
      </header>

      <div className="shop-controls container">
        <div className="filters-row">
          <div className="filter-label">
            <SlidersHorizontal size={18} />
            <span>Filtrar por:</span>
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
          Mostrando {filteredProducts.length} productos
        </div>
      </div>

      <main className="shop-grid-container container">
        {isLoading ? (
          <div className="loader">Cargando productos reales...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No hay productos disponibles por el momento.</p>
            <button className="btn-gold" onClick={() => setFilter('Todos')}>Ver todo</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Shop;
