import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Shop', href: '#' },
  { name: 'Consultants', href: '#' },
  { name: 'Contact', href: '#contacto' },
];

const Navbar = ({ onCartClick, onShopClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <a className="navbar-logo" href="#">
          <div className="navbar-logo-text">
            <span className="brand-name">JESSIAH</span>
            <span className="brand-sub">HAIR LINE</span>
          </div>
        </a>

        {/* Center links */}
        <ul className="navbar-links">
          {navLinks.map((l, i) => (
            <li key={l.name}>
              <a 
                href={l.href} 
                className={i === 0 ? 'active' : ''}
                onClick={(e) => {
                  if (l.name === 'Shop' && onShopClick) {
                    e.preventDefault();
                    onShopClick();
                  }
                }}
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
          <button className="icon-btn" aria-label="Cart" onClick={onCartClick}>
            <ShoppingBag size={16} />
          </button>
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
            <a key={l.name} href={l.href} onClick={(e) => {
              setMenuOpen(false);
              if (l.name === 'Shop' && onShopClick) {
                e.preventDefault();
                onShopClick();
              }
            }}>
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
