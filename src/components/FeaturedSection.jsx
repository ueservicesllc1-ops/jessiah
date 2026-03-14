import React from 'react';
import { motion } from 'framer-motion';

const FeaturedSection = ({ onShopClick }) => {
  return (
    <section className="featured">

      {/* ── Main row: text left + products floating right ── */}
      <div className="featured-inner">

        {/* Left — text */}
        <motion.div
          className="featured-text"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          viewport={{ once: true }}
        >
          <h2>
            Discover Luxury <br />
            <em>Beauty Products</em>
          </h2>
          <p>
            Explore our premium collection of hair care<br />
            and beauty products.
          </p>
          <button className="btn-gold" onClick={onShopClick}>Shop Now</button>
        </motion.div>

      </div>

      {/* Fading image layer positioned absolutely to blend smoothly into background */}
      <div className="featured-bg-wrap">
        <img src="/images/pro4.jpg" alt="Featured Products" />
      </div>

      {/* ── Bottom centred heading ── */}
      <div className="featured-bottom">
        <h2>Discover Luxury Beauty Products</h2>
        <p>Explore our premium collection of hair care and beauty products.</p>
      </div>

    </section>
  );
};

export default FeaturedSection;
