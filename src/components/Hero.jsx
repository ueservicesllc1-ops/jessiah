import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ onShopClick }) => {
  return (
    <section className="hero">

      {/* Hero Image — Full background for the premium feel */}
      <motion.div
        className="hero-image-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <img
          src="/images/hero.png"
          alt="Jessiah Hair Line Products"
          className="hero-full-img"
        />
        {/* Subtle overlay to help text readability on very light backgrounds */}
        <div className="hero-light-overlay" />
      </motion.div>

      {/* Left text content */}
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      >
        <img src="/images/LOGO.png" alt="Jessiah" className="hero-logo-main" />
        <div className="hero-text-badge">Professional Hair Care</div>
        
        <h1 className="hero-title">
          Elevate your <br />
          <span className="accent">Beauty Ritual</span>
        </h1>

        <p className="hero-description">
          Experience the ultimate luxury for your hair with our 
          scientifically formulated treatments, designed for professionals 
          and royalty alike.
        </p>

        <div className="hero-actions">
          <motion.button
            className="btn-gold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onShopClick}
          >
            Explore Collection
          </motion.button>
          
          <button className="btn-text-only" onClick={onShopClick}>
            View Best Sellers
          </button>
        </div>
      </motion.div>

    </section>
  );
};

export default Hero;
