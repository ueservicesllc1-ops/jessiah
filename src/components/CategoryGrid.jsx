import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Hair Care',      img: '/images/hair_care.png' },
  { name: 'Styling Tools',  img: '/images/styling_tools.png' },
  { name: 'Skin Care',      img: '/images/skin_care.png' },
  { name: 'Accessories',    img: '/images/accessories.png' },
];

const CategoryGrid = ({ onShopClick }) => {
  return (
    <section className="categories">
      <div className="categories-grid">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.name}
            className="cat-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="cat-card-img">
              <img src={cat.img} alt={cat.name} />
            </div>
            <h3>{cat.name}</h3>
            <button 
              className="btn-gold" 
              style={{ padding: '9px 28px', fontSize: '0.7rem' }}
              onClick={onShopClick}
            >
              Shop Now
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
