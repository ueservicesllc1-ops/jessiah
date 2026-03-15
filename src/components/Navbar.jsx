import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Shop', href: '#' },
  { name: 'Consultants', href: '#' },
  { name: 'Contact', href: '#contacto' },
];

const Navbar = ({ onCartClick, onShopClick, onHomeClick, onAboutClick, onContactClick, currentView, cartCount = 0 }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (e, name, href) => {
    e.preventDefault();
    if (name === 'Home') onHomeClick?.();
    else if (name === 'About') onAboutClick?.();
    else if (name === 'Shop') onShopClick?.();
    else if (name === 'Contact') onContactClick?.();
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
          {navLinks.map((l, i) => (
            <li key={l.name}>
              <a 
                href={l.href} 
                className={currentView === l.name.toLowerCase() ? 'active' : ''}
                onClick={(e) => handleNavClick(e, l.name, l.href)}
              >
                {l.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div className="navbar-right">
          <button className="icon-btn" aria-label="Search">
            <Search size={16} />
          </button>
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
            Shop Now
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
              key={l.name} 
              href={l.href} 
              className={currentView === l.name.toLowerCase() ? 'active' : ''}
              onClick={(e) => {
                setMenuOpen(false);
                handleNavClick(e, l.name, l.href);
              }}
            >
              {l.name}
            </a>
          ))}
          <button className="btn-gold" onClick={() => { setMenuOpen(false); onShopClick(); }}>
            Shop Now
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
