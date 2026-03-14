import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare, Phone } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('¡Gracias por contactarnos! Te responderemos pronto.');
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
          <h2 className="section-title">Get in <em>Touch</em></h2>
          <p className="section-subtitle">
            ¿Tienes alguna pregunta sobre nuestros productos o servicios? 
            Nuestro equipo de expertos está listo para asesorarte.
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
                  placeholder="Tu Nombre"
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
                    placeholder="Correo Electrónico"
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
                    placeholder="Teléfono"
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
                  placeholder="¿Cómo podemos ayudarte?"
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
                <span>Enviar Mensaje</span>
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
              <img src="/images/contact_experience.png" alt="Luxury Beauty" className="visual-img" />
              <div className="card-content">
                <h3>VIVE LA EXPERIENCIA <em>JESSIAH</em></h3>
                <p>Tratamientos diseñados para la realeza.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
