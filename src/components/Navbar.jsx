import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Shop', href: '#' },
  { name: 'Consultants', href: '#' },
  { name: 'Contact', href: '#contacto' },
];

const Navbar = ({ 
  onCartClick, onShopClick, onHomeClick, onAboutClick, onContactClick, 
  currentView, cartCount = 0, language, setLanguage, t 
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: t.nav.home, key: 'Home' },
    { name: t.nav.about, key: 'About' },
    { name: t.nav.shop, key: 'Shop' },
    { name: t.nav.contact, key: 'Contact', href: '#contacto' },
  ];

  const handleNavClick = (e, key) => {
    e.preventDefault();
    if (key === 'Home') onHomeClick?.();
    else if (key === 'About') onAboutClick?.();
    else if (key === 'Shop') onShopClick?.();
    else if (key === 'Contact') onContactClick?.();
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <a className="navbar-logo" href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <img src="/images/LOGO.png" alt="Jessiah Logo" style={{ height: '50px', width: 'auto' }} />
        </a>

        {/* Center links */}
        <ul className="navbar-links">
          {navLinks.map((l) => (
            <li key={l.key}>
              <a 
                href={l.href || '#'} 
                className={currentView === l.key.toLowerCase() ? 'active' : ''}
                onClick={(e) => handleNavClick(e, l.key)}
              >
                {l.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div className="navbar-right">
          <div className="lang-switcher">
            <button 
              className={`lang-btn ${language === 'es' ? 'active' : ''}`} 
              onClick={() => setLanguage('es')}
            >
              ES
            </button>
            <span className="lang-divider">|</span>
            <button 
              className={`lang-btn ${language === 'en' ? 'active' : ''}`} 
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>

          <div className="cart-btn-wrapper">
            <button className="icon-btn" aria-label="Cart" onClick={onCartClick}>
              <ShoppingBag size={18} />
            </button>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
          <button 
            className="btn-gold" 
            style={{ padding: '9px 22px', fontSize: '0.68rem' }}
            onClick={onShopClick}
          >
            {t.nav.shop_now}
          </button>
          <button
            className="icon-btn mobile-menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="mobile-menu">
          <button
            className="icon-btn"
            style={{ position: 'absolute', top: 22, right: 24, color: 'white' }}
            onClick={() => setMenuOpen(false)}
          >
            <X size={26} />
          </button>
          {navLinks.map((l) => (
            <a 
              key={l.key} 
              href={l.href || '#'} 
              className={currentView === l.key.toLowerCase() ? 'active' : ''}
              onClick={(e) => {
                setMenuOpen(false);
                handleNavClick(e, l.key);
              }}
            >
              {l.name}
            </a>
          ))}
          
          <div className="mobile-lang-switcher">
            <span onClick={() => { setLanguage('es'); setMenuOpen(false); }}>ESPAÑOL</span>
            <span className="divider">/</span>
            <span onClick={() => { setLanguage('en'); setMenuOpen(false); }}>ENGLISH</span>
          </div>

          <button className="btn-gold" onClick={() => { setMenuOpen(false); onShopClick(); }}>
            {t.nav.shop_now}
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
