import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedSection from './components/FeaturedSection';
import CategoryGrid from './components/CategoryGrid';
import ContactForm from './components/ContactForm';
import CartDrawer from './components/CartDrawer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsAndConditions from './components/TermsAndConditions';
import AboutUs from './components/AboutUs';
import Shop from './components/Shop';
import Admin from './components/Admin';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [cartItems, setCartItems] = useState([]);

  const navigateToHome = () => setCurrentView('home');
  const navigateToPrivacy = () => setCurrentView('privacy');
  const navigateToTerms = () => setCurrentView('terms');
  const navigateToAbout = () => setCurrentView('about');
  const navigateToShop = () => setCurrentView('shop');
  const navigateToAdmin = () => setCurrentView('admin');

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
    setIsCartOpen(true);
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
    <div>
      {currentView === 'home' ? (
        <>
          <Navbar onCartClick={() => setIsCartOpen(true)} onShopClick={navigateToShop} />
          <main>
            <Hero onShopClick={navigateToShop} />
            <FeaturedSection onShopClick={navigateToShop} />
            <CategoryGrid onShopClick={navigateToShop} />
            <ContactForm />
          </main>
        </>
      ) : currentView === 'privacy' ? (
        <PrivacyPolicy onBack={navigateToHome} />
      ) : currentView === 'terms' ? (
        <TermsAndConditions onBack={navigateToHome} />
      ) : currentView === 'about' ? (
        <AboutUs onBack={navigateToHome} />
      ) : currentView === 'shop' ? (
        <Shop onBack={navigateToHome} onAddToCart={handleAddToCart} />
      ) : (
        <Admin onBack={navigateToHome} />
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems}
        updateQuantity={updateCartQuantity}
        removeItem={removeFromCart}
        setCartItems={setCartItems}
      />

      {currentView !== 'admin' && (
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-left">
              <div className="footer-logo">
                <img src="/images/logo2.png" alt="Jessiah Hair Line" />
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
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem', cursor: 'pointer' }}
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
