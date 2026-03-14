import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedSection from './components/FeaturedSection';
import CategoryGrid from './components/CategoryGrid';

function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <FeaturedSection />
        <CategoryGrid />
      </main>

      <footer className="footer">
        <div className="footer-logo">
          <img src="/images/LOGO.png" alt="Jessiah Logo" />
          <div className="footer-logo-text">
            <span className="brand-name">Jessiah</span>
            <span className="brand-sub">Hair Line</span>
          </div>
        </div>
        <p>
          The ultimate destination for premium hair care and beauty solutions.<br />
          Elevate your style with Jessiah.
        </p>
        <div className="footer-divider" />
        <p className="footer-copy">
          © 2026 Jessiah Hair Line. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
