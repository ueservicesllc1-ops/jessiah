import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';


import ContactForm from './components/ContactForm';
import Cart from './components/Cart';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsAndConditions from './components/TermsAndConditions';
import AboutUs from './components/AboutUs';
import Shop from './components/Shop';
import Admin from './components/Admin';
import WhyChoose from './components/WhyChoose';
import BestSellers from './components/BestSellers';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [cartItems, setCartItems] = useState([]);

  const navigateToHome = () => setCurrentView('home');
  const navigateToPrivacy = () => setCurrentView('privacy');
  const navigateToTerms = () => setCurrentView('terms');
  const navigateToAbout = () => setCurrentView('about');
  const navigateToShop = () => setCurrentView('shop');
  const navigateToAdmin = () => setCurrentView('admin');
  const navigateToCart = () => setCurrentView('cart');

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    navigateToCart();
  };

  const updateCartQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="app-container">
      <Navbar 
        onCartClick={navigateToCart} 
        onShopClick={navigateToShop}
        onHomeClick={navigateToHome}
        onAboutClick={navigateToAbout}
        onContactClick={() => {
          navigateToHome();
          setTimeout(() => {
            const el = document.getElementById('contacto');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        currentView={currentView}
      />

      <main className="content-wrap">
        {currentView === 'home' ? (
          <>
            <Hero onShopClick={navigateToShop} />
            <WhyChoose />
            <BestSellers onAddToCart={handleAddToCart} />


            <ContactForm />
          </>
        ) : currentView === 'privacy' ? (
          <PrivacyPolicy onBack={navigateToHome} />
        ) : currentView === 'terms' ? (
          <TermsAndConditions onBack={navigateToHome} />
        ) : currentView === 'about' ? (
          <AboutUs onBack={navigateToHome} />
        ) : currentView === 'shop' ? (
          <Shop onBack={navigateToHome} onAddToCart={handleAddToCart} />
        ) : currentView === 'cart' ? (
          <Cart 
            onBack={navigateToShop} 
            cartItems={cartItems}
            updateQuantity={updateCartQuantity}
            removeItem={removeFromCart}
            setCartItems={setCartItems}
          />
        ) : (
          <Admin onBack={navigateToHome} />
        )}
      </main>

      {currentView !== 'admin' && (
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-left">
              <div className="footer-logo">
                <img src="/images/LOGO.png" alt="Jessiah Hair Line" />
              </div>
            </div>
            
            <div className="footer-center">
              <ul className="footer-nav">
                <li><a href="#contacto" onClick={(e) => {
                  if(currentView !== 'home') {
                    e.preventDefault();
                    navigateToHome();
                    setTimeout(() => window.location.hash = 'contacto', 100);
                  }
                }}>Contacto</a></li>
                <li><a href="#privacy" onClick={(e) => { e.preventDefault(); navigateToPrivacy(); }}>Política de Privacidad</a></li>
                <li><a href="#nosotros" onClick={(e) => { e.preventDefault(); navigateToAbout(); }}>Nosotros</a></li>
                <li><a href="#terms" onClick={(e) => { e.preventDefault(); navigateToTerms(); }}>Términos y Condiciones</a></li>
              </ul>
            </div>

            <div className="footer-right" /> {/* Spacer for centering */}
          </div>

          <div className="footer-bottom">
            <div className="footer-divider" />
            <div className="footer-bottom-content">
              <p className="footer-copy">
                © 2026 Jessiah Hair Line. All rights reserved.
              </p>
              <button 
                className="admin-login-link" 
                onClick={navigateToAdmin}
                style={{ background: 'none', border: 'none', color: '#000', fontSize: '0.65rem', fontWeight: 'bold', cursor: 'pointer', opacity: 0.6 }}
              >
                Acceso Admin
              </button>
            </div>
            <p className="footer-credits">
              Potenciado y diseñado por <a href="https://freedomlabs.dev" target="_blank" rel="noopener noreferrer">Freedom Labs</a>
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
