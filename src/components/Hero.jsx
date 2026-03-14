import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ onShopClick }) => {
  return (
    <section className="hero">

      {/* Dark base + ambient warm glow */}
      <div className="hero-ambient" aria-hidden="true" />

      {/* Model image — right side, fully visible */}
      <motion.div
        className="hero-model-wrap"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      >
        <img
          src="/images/mujer.png"
          alt="Jessiah model"
          className="hero-model-img"
        />
        {/* Gradient to blend with black on the left */}
        <div className="hero-model-fade" />
      </motion.div>

      {/* Left text content */}
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, x: -36 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.95, ease: 'easeOut' }}
      >
        {/* logo2 — JS monogram + JESSIAH + HAIR LINE */}
        <img
          src="/images/logo2.png"
          alt="Jessiah Hair Line"
          className="hero-logo"
        />

        {/* Tagline */}
        <p className="hero-tagline">
          Enhance <span className="highlight">Your Beauty</span> with
          <br />
          <span className="highlight-bold">Premium</span> Hair Care Products
        </p>

        <p className="hero-subtitle">
          Top-tier treatment for <br /> royalty products.
        </p>

        <motion.button
          className="btn-gold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          style={{ padding: '13px 36px', fontSize: '0.78rem' }}
          onClick={onShopClick}
        >
          Shop Now
        </motion.button>
      </motion.div>

    </section>
  );
};

export default Hero;
