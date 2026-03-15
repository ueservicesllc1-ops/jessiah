import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ onShopClick, t }) => {
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
        <div className="hero-text-badge">{t.tag}</div>
        
        <h1 className="hero-title">
          {t.title1} <br />
          <span className="accent">{t.title2}</span>
        </h1>

        <p className="hero-description">
          {t.subtitle}
        </p>

        <div className="hero-actions">
          <motion.button
            className="btn-gold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onShopClick}
          >
            {t.shop_now}
          </motion.button>
          
          <button className="btn-text-only" onClick={onShopClick}>
            {t.explore}
          </button>
        </div>
      </motion.div>

    </section>
  );
};

export default Hero;
