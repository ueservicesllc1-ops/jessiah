import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gavel, CreditCard, Truck, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';

const TermsAndConditions = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "1. Aceptación de Términos",
      icon: <Gavel size={22} />,
      content: "Al acceder y utilizar este sitio web, usted acepta estar sujeto a los términos y condiciones aquí descritos. Si no está de acuerdo con alguna parte de estos términos, le rogamos que no utilice nuestros servicios."
    },
    {
      title: "2. Productos y Precios",
      icon: <CreditCard size={22} />,
      content: "Jessiah Hair Line se reserva el derecho de modificar los precios y la disponibilidad de los productos en cualquier momento sin previo aviso. Nos esforzamos por mostrar los colores y detalles de los productos con la mayor precisión posible."
    },
    {
      title: "3. Envíos y Entregas",
      icon: <Truck size={22} />,
      content: "Los tiempos de entrega son estimados y pueden variar según la ubicación y la logística de terceros. No nos hacemos responsables por retrasos fuera de nuestro control directo, aunque trabajamos para minimizarlos."
    },
    {
      title: "4. Devoluciones y Cambios",
      icon: <RefreshCw size={22} />,
      content: "Debido a la naturaleza de los productos de cuidado personal e higiene, solo se aceptan devoluciones de productos sin abrir, con sellos intactos, dentro de los 14 días posteriores a la compra."
    },
    {
      title: "5. Propiedad Intelectual",
      icon: <AlertCircle size={22} />,
      content: "Todo el contenido de este sitio (logos, imágenes, textos) es propiedad exclusiva de Jessiah Hair Line y está protegido por leyes de derechos de autor internacionales."
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
            Términos y <em>Condiciones</em>
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
            Bienvenido a <strong>Jessiah Hair Line</strong>. Los siguientes términos regulan el uso de nuestra tienda online y la adquisición de nuestros productos exclusivos de cuidado capilar profesional.
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
          <h3>Acuerdo de Usuario</h3>
          <p>Al realizar una compra, usted confirma que tiene la mayoría de edad legal y que la información proporcionada es veraz y exacta.</p>
        </motion.div>
      </main>
    </div>
  );
};

export default TermsAndConditions;
