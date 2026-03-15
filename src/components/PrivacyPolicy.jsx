import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';

const PrivacyPolicy = ({ onBack, t }) => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: t.s1_t,
      icon: <Eye size={22} />,
      content: t.s1_c
    },
    {
      title: t.s2_t,
      icon: <FileText size={22} />,
      content: t.s2_c
    },
    {
      title: t.s3_t,
      icon: <Lock size={22} />,
      content: t.s3_c
    },
    {
      title: t.s4_t,
      icon: <Shield size={22} />,
      content: t.s4_c
    }
  ];

  return (
    <div className="privacy-page">
      {/* Header Specific for the Page */}
      <section className="page-hero privacy-hero">
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

        <motion.div 
          className="contact-info-block"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3>{t.q}</h3>
          <p>{t.q_desc}</p>
          <a href="mailto:privacy@jessiah.com" className="privacy-email">privacy@jessiah.com</a>
        </motion.div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
