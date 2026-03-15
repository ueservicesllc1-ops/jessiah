import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gavel, CreditCard, Truck, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';

const TermsAndConditions = ({ onBack, t }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: t.s1_t,
      icon: <Gavel size={22} />,
      content: t.s1_c
    },
    {
      title: t.s2_t,
      icon: <CreditCard size={22} />,
      content: t.s2_c
    },
    {
      title: t.s3_t,
      icon: <Truck size={22} />,
      content: t.s3_c
    },
    {
      title: t.s4_t,
      icon: <RefreshCw size={22} />,
      content: t.s4_c
    }
  ];

  return (
    <div className="terms-page">
      <section className="page-hero terms-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t.title} <em>{t.title_em}</em>
          </motion.h1>
          <p className="last-updated">{t.last}</p>
        </div>
      </section>

      <main className="privacy-content container">
        <motion.div 
          className="intro-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p>
            {t.intro}
          </p>
        </motion.div>

        <div className="sections-grid">
          {sections.map((section, idx) => (
            <motion.section 
              key={idx} 
              className="privacy-section-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="section-icon">{section.icon}</div>
              <h3>{section.title}</h3>
              <p>{section.content}</p>
            </motion.section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditions;
