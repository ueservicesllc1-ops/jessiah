import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare, Phone } from 'lucide-react';

const ContactForm = ({ t }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(t.thanks);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="contact-section" id="contacto">
      <div className="contact-container">
        <motion.div 
          className="contact-info"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">{t.title} <em>{t.title_em}</em></h2>
          <p className="section-subtitle">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="contact-grid">
          {/* Form Side */}
          <motion.div 
            className="contact-form-wrapper"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="premium-form">
              <div className="form-group">
                <div className="input-icon">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder={t.name}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <div className="input-icon">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder={t.email}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <div className="input-icon">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder={t.phone}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-icon textarea-icon">
                  <MessageSquare size={18} />
                </div>
                <textarea
                  name="message"
                  placeholder={t.message}
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <motion.button
                type="submit"
                className="btn-gold submit-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{t.send}</span>
                <Send size={18} />
              </motion.button>
            </form>
          </motion.div>

          {/* Experience Side */}
          <motion.div 
            className="contact-visual"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="visual-card">
              <div className="card-overlay" />
              <img src="/images/contact_dropper.jpg" alt="Jessiah Dropper" className="visual-img" />
              <div className="card-content">
                <h3>{t.experience} <em>{t.exp_em}</em></h3>
                <p>{t.exp_desc}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
