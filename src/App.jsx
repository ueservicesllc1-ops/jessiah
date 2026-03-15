import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, X } from 'lucide-react';


import ContactForm from './components/ContactForm';
import Cart from './components/Cart';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsAndConditions from './components/TermsAndConditions';
import AboutUs from './components/AboutUs';
import Shop from './components/Shop';
import Admin from './components/Admin';
import WhyChoose from './components/WhyChoose';
import BestSellers from './components/BestSellers';
import { translations } from './translations';

function App() {
  const [language, setLanguage] = useState('es');
  const t = translations[language];

   const [currentView, setCurrentView] = useState('home');
   const [cartItems, setCartItems] = useState([]);
   const [addedItem, setAddedItem] = useState(null);
   const [showAddedModal, setShowAddedModal] = useState(false);

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
    setAddedItem(product);
    setShowAddedModal(true);
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
         cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
         language={language}
         setLanguage={setLanguage}
         t={t}
       />

       <main className="content-wrap">
         {currentView === 'home' ? (
           <>
             <Hero onShopClick={navigateToShop} t={t.hero} />
             <WhyChoose t={t.why} />
             <BestSellers onAddToCart={handleAddToCart} t={t.best} catT={t.categories} />


             <ContactForm t={t.contact} />
           </>
         ) : currentView === 'privacy' ? (
           <PrivacyPolicy onBack={navigateToHome} t={t.privacy} />
         ) : currentView === 'terms' ? (
           <TermsAndConditions onBack={navigateToHome} t={t.terms} />
         ) : currentView === 'about' ? (
           <AboutUs onBack={navigateToHome} t={t.about} />
         ) : currentView === 'shop' ? (
           <Shop onBack={navigateToHome} onAddToCart={handleAddToCart} t={t.shop} catT={t.categories} />
         ) : currentView === 'cart' ? (
           <Cart 
             onBack={navigateToShop} 
             cartItems={cartItems}
             updateQuantity={updateCartQuantity}
             removeItem={removeFromCart}
             setCartItems={setCartItems}
             t={t.cart}
           />
         ) : (
           <Admin onBack={navigateToHome} t={t.admin} />
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
                 }}>{t.nav.contact}</a></li>
                 <li><a href="#privacy" onClick={(e) => { e.preventDefault(); navigateToPrivacy(); }}>{t.footer.privacy}</a></li>
                 <li><a href="#nosotros" onClick={(e) => { e.preventDefault(); navigateToAbout(); }}>{t.footer.nosotros}</a></li>
                 <li><a href="#terms" onClick={(e) => { e.preventDefault(); navigateToTerms(); }}>{t.footer.terms}</a></li>
               </ul>
             </div>
 
             <div className="footer-right" /> {/* Spacer for centering */}
           </div>
 
           <div className="footer-bottom">
             <div className="footer-divider" />
             <div className="footer-bottom-content">
               <p className="footer-copy">
                 {t.footer.rights}
               </p>
               <button 
                 className="admin-login-link" 
                 onClick={navigateToAdmin}
                 style={{ background: 'none', border: 'none', color: '#000', fontSize: '0.65rem', fontWeight: 'bold', cursor: 'pointer', opacity: 0.6 }}
               >
                 {t.footer.admin}
               </button>
             </div>
             <p className="footer-credits">
               {t.footer.credits} <a href="https://freedomlabs.dev" target="_blank" rel="noopener noreferrer">Freedom Labs</a>
             </p>
           </div>
         </footer>
       )}
 
       {/* Modal de "Producto Agregado" */}
       {showAddedModal && addedItem && (
         <div className="added-modal-overlay">
           <motion.div 
             className="added-modal-card"
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
           >
             <div className="added-modal-icon">
               <CheckCircle size={40} />
             </div>
             <h2>{t.modal.added}</h2>
             <p>{t.modal.added_desc || t.modal.desc}</p>
             
             <div className="product-shortcut">
               <img src={addedItem.image} alt={addedItem.name} className="shortcut-img" />
               <div className="shortcut-info">
                 <h4>{addedItem.name}</h4>
                 <p>${addedItem.price?.toFixed(2)}</p>
               </div>
             </div>
 
             <div className="modal-actions">
               <button className="btn-gold modal-btn-view" onClick={() => { setShowAddedModal(false); navigateToCart(); }}>
                 {t.modal.view_cart} <ShoppingBag size={16} style={{ marginLeft: '10px' }} />
               </button>
               <button className="modal-btn-continue" onClick={() => setShowAddedModal(false)}>
                 {t.modal.continue}
               </button>
             </div>
           </motion.div>
         </div>
       )}
     </div>
  );
}

export default App;
