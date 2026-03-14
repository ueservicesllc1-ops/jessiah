import React from 'react';
import { motion } from 'framer-motion';

const FeaturedSection = () => {
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
          <button className="btn-gold">Shop Now</button>
        </motion.div>

        {/* Right — products floating (no box, no square crop) */}
        <motion.div
          className="featured-image"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <img
            src="/images/products_featured.png"
            alt="Jessiah Premium Products"
          />
        </motion.div>
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
