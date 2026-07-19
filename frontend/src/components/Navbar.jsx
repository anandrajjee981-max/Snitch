import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './productroute.slice';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';

export default function Navbar({ activeCategory, setActiveCategory }) {
  const navigate = useNavigate();
  const { toggleCart, cartCount } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    if (setActiveCategory) setActiveCategory('All');
    navigate('/dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (category) => {
    if (setActiveCategory) setActiveCategory(category);
    setIsMobileMenuOpen(false);
    navigate('/dashboard');

    // Scroll down to the storefront section
    setTimeout(() => {
      const element = document.getElementById('storefront');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
      }
    }, 120);
  };

  return (
    <>
      <nav className={`navbar glass-panel ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo" onClick={handleLogoClick}>
          AURA <span>clct</span>
        </div>

        <div className="nav-links">
          <button 
            className={`hover-skew-effect ${activeCategory === 'All' ? 'active-link' : ''}`}
            onClick={() => handleNavClick('All')}
            style={{ fontWeight: activeCategory === 'All' ? '700' : '500', color: activeCategory === 'All' ? '#4e3629' : '' }}
          >
            Shop All
          </button>
          <button 
            className={`hover-skew-effect ${activeCategory === 'T-Shirts' ? 'active-link' : ''}`}
            onClick={() => handleNavClick('T-Shirts')}
            style={{ fontWeight: activeCategory === 'T-Shirts' ? '700' : '500', color: activeCategory === 'T-Shirts' ? '#4e3629' : '' }}
          >
            T-Shirts
          </button>
          <button 
            className={`hover-skew-effect ${activeCategory === 'Hoodies' ? 'active-link' : ''}`}
            onClick={() => handleNavClick('Hoodies')}
            style={{ fontWeight: activeCategory === 'Hoodies' ? '700' : '500', color: activeCategory === 'Hoodies' ? '#4e3629' : '' }}
          >
            Hoodies
          </button>
          <button 
            className={`hover-skew-effect ${activeCategory === 'Cargos' ? 'active-link' : ''}`}
            onClick={() => handleNavClick('Cargos')}
            style={{ fontWeight: activeCategory === 'Cargos' ? '700' : '500', color: activeCategory === 'Cargos' ? '#4e3629' : '' }}
          >
            Cargos
          </button>
        </div>

        <div className="nav-actions">
          <button className="icon-btn" aria-label="Search">
            <Search size={20} />
          </button>
          <Link to="/" className="icon-btn" aria-label="Account">
            <User size={20} />
          </Link>
          <button className="icon-btn" onClick={toggleCart} aria-label="Shopping Bag">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button 
            className="icon-btn menu-mobile-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation panel */}
      {isMobileMenuOpen && (
        <div 
          className="glass-panel" 
          style={{
            position: 'fixed',
            top: '80px',
            left: 0,
            width: '100%',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            padding: '2rem 1.5rem',
            borderBottom: '1px solid rgba(78, 54, 41, 0.1)',
            boxShadow: '0 10px 30px rgba(78, 54, 41, 0.05)'
          }}
        >
          <button 
            onClick={() => handleNavClick('All')} 
            style={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: activeCategory === 'All' ? '700' : '500', color: activeCategory === 'All' ? '#4e3629' : '' }}
          >
            Shop All
          </button>
          <button 
            onClick={() => handleNavClick('T-Shirts')} 
            style={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: activeCategory === 'T-Shirts' ? '700' : '500', color: activeCategory === 'T-Shirts' ? '#4e3629' : '' }}
          >
            T-Shirts
          </button>
          <button 
            onClick={() => handleNavClick('Hoodies')} 
            style={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: activeCategory === 'Hoodies' ? '700' : '500', color: activeCategory === 'Hoodies' ? '#4e3629' : '' }}
          >
            Hoodies
          </button>
          <button 
            onClick={() => handleNavClick('Cargos')} 
            style={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: activeCategory === 'Cargos' ? '700' : '500', color: activeCategory === 'Cargos' ? '#4e3629' : '' }}
          >
            Cargos
          </button>
        </div>
      )}
    </>
  );
}
