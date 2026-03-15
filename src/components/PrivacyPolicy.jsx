import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';

const PrivacyPolicy = ({ onBack }) => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "1. Información que Recopilamos",
      icon: <Eye size={22} />,
      content: `Recopilamos varios tipos de información para brindarle y mejorar nuestros servicios. Esto incluye información personal que nos proporciona directamente, como su nombre, dirección de facturación, dirección de envío, dirección de correo electrónico y número de teléfono cuando realiza una compra o se suscribe a nuestro boletín.`
    },
    {
      title: "2. Cómo Utilizamos su Información",
      icon: <FileText size={22} />,
      content: `Utilizamos la información recopilada para diversos fines comerciales, que incluyen: Procesar sus compras y gestionar el envío, comunicarnos con usted sobre sus pedidos, enviarle información promocional (siempre que haya dado su consentimiento), mejorar nuestro sitio web y prevenir fraudes o actividades maliciosas.`
    },
    {
      title: "3. Uso de Cookies",
      icon: <Lock size={22} />,
      content: `Utilizamos cookies y tecnologías de seguimiento similares para rastrear la actividad en nuestro servicio y mantener cierta información. Las cookies son archivos con una pequeña cantidad de datos que pueden incluir un identificador único anónimo. Usted puede configurar su navegador para rechazar todas las cookies.`
    },
    {
      title: "4. Seguridad de los Datos",
      icon: <Shield size={22} />,
      content: `La seguridad de sus datos es importante para nosotros. Implementamos medidas de seguridad estándar de la industria para proteger su información personal. Sin embargo, recuerde que ningún método de transmisión por Internet o método de almacenamiento electrónico es 100% seguro.`
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
            Política de <em>Privacidad</em>
          </motion.h1>
          <p className="last-updated">Última actualización: Marzo 2026</p>
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
            En <strong>Jessiah Hair Line</strong>, valoramos profundamente su privacidad y estamos comprometidos con la protección de sus datos personales. Esta Política de Privacidad describe cómo recopilamos, utilizamos y divulgamos su información cuando visita nuestro sitio web o utiliza nuestros servicios de cuidado capilar de lujo.
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
          <h3>¿Preguntas sobre su privacidad?</h3>
          <p>Si tiene alguna pregunta sobre esta Política de Privacidad, puede contactarnos enviando un correo a:</p>
          <a href="mailto:privacy@jessiah.com" className="privacy-email">privacy@jessiah.com</a>
        </motion.div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
