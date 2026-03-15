import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Target, Award, ArrowLeft, Quote } from 'lucide-react';

const AboutUs = ({ onBack, t }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      <section className="page-hero about-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t.title} <em>{t.title_em}</em>
          </motion.h1>
          <p className="last-updated">{t.legacy}</p>
        </div>
      </section>

      <main className="about-content">
        <section className="story-intro container">
          <div className="story-grid">
            <motion.div 
              className="story-text"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="accent-gold">{t.dream}</div>
              <h2>{t.excelence_title} <em>{t.excelence_em}</em></h2>
              <p>{t.p1}</p>
              <p>{t.p2}</p>
            </motion.div>
            <motion.div 
              className="story-image-wrap"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="luxury-frame">
                <img src="https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=1000&auto=format&fit=crop" alt="Creating the formula" />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mission-values">
          <div className="container">
            <div className="values-grid">
              <motion.div className="value-card" whileHover={{ y: -10 }}>
                <Heart className="value-icon" />
                <h3>{t.v1_t}</h3>
                <p>{t.v1_d}</p>
              </motion.div>
              <motion.div className="value-card" whileHover={{ y: -10 }}>
                <Sparkles className="value-icon" />
                <h3>{t.v2_t}</h3>
                <p>{t.v2_d}</p>
              </motion.div>
              <motion.div className="value-card" whileHover={{ y: -10 }}>
                <Target className="value-icon" />
                <h3>{t.v3_t}</h3>
                <p>{t.v3_d}</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="story-quote container">
          <motion.div 
            className="quote-block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Quote className="quote-icon" />
            <blockquote>{t.quote}</blockquote>
            <cite>{t.author}</cite>
          </motion.div>
        </section>

        <section className="overcoming container">
          <div className="overcoming-content">
            <div className="text">
              <h2>{t.overcoming}</h2>
              <p>{t.p3}</p>
              <div className="stats">
                <div className="stat-item">
                  <Award />
                  <span>{t.stats}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
