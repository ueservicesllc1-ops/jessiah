import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Milk, Sprout, FlaskConical, Ban } from 'lucide-react';

const benefits = [
  {
    icon: <Leaf size={28} />,
    title: '100% Natural',
    subtitle: 'Pure and natural care'
  },
  {
    icon: <Milk size={28} />,
    title: 'Handmade',
    subtitle: 'Crafted in small batches'
  },
  {
    icon: <Sprout size={28} />,
    title: 'Organic Ingredients',
    subtitle: 'Rosemary & ginger extracts'
  },
  {
    icon: <FlaskConical size={28} />,
    title: 'Chemical Free',
    subtitle: 'No harsh chemicals'
  },
  {
    icon: <Ban size={28} />,
    title: 'Paraben Free',
    subtitle: 'No preservatives'
  }
];

const WhyChoose = ({ t }) => {
  const benefitIcons = [
    <Leaf size={28} />,
    <Milk size={28} />,
    <Sprout size={28} />,
    <FlaskConical size={28} />,
    <Ban size={28} />
  ];

  return (
    <section className="why-choose">
      <div className="container">
        <motion.h2 
          className="why-choose-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {t.title}
        </motion.h2>

        <div className="benefits-grid">
          {t.items.map((benefit, idx) => (
            <motion.div 
              key={idx}
              className="benefit-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="benefit-icon">
                {benefitIcons[idx]}
              </div>
              <div className="benefit-content">
                <h3>{benefit.title}</h3>
                <p>{benefit.desc}</p>
              </div>
              {idx < t.items.length - 1 && <div className="benefit-divider" />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
