import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Target, Award, ArrowLeft, Quote } from 'lucide-react';

const AboutUs = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      <header className="page-header about-header">
        <div className="container">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Nuestra <em>Historia</em>
          </motion.h1>
          <p className="last-updated">El legado de Jessiah Hair Line</p>
        </div>
      </header>

      <main className="about-content">
        <section className="story-intro container">
          <div className="story-grid">
            <motion.div 
              className="story-text"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="accent-gold">Nace un Sueño</div>
              <h2>De la necesidad a la <em>excelencia</em></h2>
              <p>
                Jessiah Hair Line no comenzó en un laboratorio reluciente, sino en un rincón lleno de esperanza y determinación. Nuestra fundadora, <strong>Jessiah</strong>, vivió gran parte de su vida buscando el secreto para un cabello verdaderamente saludable y majestuoso. Tras años de frustraciones con productos comerciales que solo ofrecían soluciones temporales, decidió que el mundo merecía algo mejor.
              </p>
              <p>
                Con poco más que un puñado de ingredientes naturales y una visión inquebrantable, Jessiah comenzó a experimentar en su propia cocina. Fueron noches de estudio profundo, meses de pruebas y un compromiso absoluto con la calidad lo que dio vida a nuestra primera fórmula magistral.
              </p>
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
                <h3>Pasión Real</h3>
                <p>Amamos lo que hacemos. Cada frasco de Jessiah lleva consigo el amor y el respeto por la belleza natural.</p>
              </motion.div>
              <motion.div className="value-card" whileHover={{ y: -10 }}>
                <Sparkles className="value-icon" />
                <h3>Innovación</h3>
                <p>Combinamos secretos ancestrales con la tecnología capilar más avanzada del mercado.</p>
              </motion.div>
              <motion.div className="value-card" whileHover={{ y: -10 }}>
                <Target className="value-icon" />
                <h3>Compromiso</h3>
                <p>Nuestra misión es empoderar a cada mujer y hombre a sentirse como la realeza que ya son.</p>
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
            <blockquote>
              "El cabello es la corona que nunca te quitas. Mi misión fue asegurarme de que esa corona brillara más que ninguna otra, sin importar los obstáculos en el camino."
            </blockquote>
            <cite>— Jessiah, Fundadora</cite>
          </motion.div>
        </section>

        <section className="overcoming container">
          <div className="overcoming-content">
            <div className="text">
              <h2>Superando lo <em>imposible</em></h2>
              <p>
                El camino no fue fácil. Enfrentamos portazos de grandes distribuidoras y la incredulidad de una industria saturada. Pero cada "no" se convirtió en el combustible para perfeccionar Jessiah. Hoy, lo que empezó como un sueño solitario es una marca reconocida por su excelencia y resultados transformadores.
              </p>
              <div className="stats">
                <div className="stat-item">
                  <Award />
                  <span>+10K Clientes Felices</span>
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
