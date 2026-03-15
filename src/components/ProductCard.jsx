import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onAddToCart, t, catT }) => {
  const getCategoryLabel = (category) => {
    if (!catT) return category;
    const map = {
      'Limpieza': catT.cleaning,
      'Hidratación': catT.hydration,
      'Tratamiento': catT.treatment,
      'Acabado': catT.finish,
      'Nutrición': catT.nutrition,
      'Cleaning': catT.cleaning,
      'Hydration': catT.hydration,
      'Treatment': catT.treatment,
      'Finish': catT.finish,
      'Nutrition': catT.nutrition
    };
    return map[category] || category;
  };

  return (
    <motion.div 
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="product-image-container">
        {product.isNew && <span className="product-badge">{t?.new_tag || 'Nuevo'}</span>}
        <img src={product.image} alt={product.name} className="product-image" />
        <button 
          className="quick-add-btn" 
          onClick={() => onAddToCart(product)}
        >
          <ShoppingBag size={18} />
          <span>{t?.add_to_cart || 'Añadir al Carrito'}</span>
        </button>
      </div>
      
      <div className="product-info">
        <div className="product-category">{getCategoryLabel(product.category)}</div>
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={11} 
              fill={i < (product.rating || 5) ? "#c8882a" : "none"} 
              stroke="#c8882a" 
              strokeWidth={1.5}
            />
          ))}
          {product.reviews > 0 && <span>({product.reviews})</span>}
        </div>
        
        <div className="product-price">
          <span className="current-price">${product.price.toFixed(2)}</span>
          {product.oldPrice && <span className="old-price">${product.oldPrice.toFixed(2)}</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
