import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCart } from './productroute.slice';
import { ShoppingBag, Search, User } from 'lucide-react';
import useSearch from './hooks/usesearch';

export default function Navbar({ activeCategory, setActiveCategory }) {
  const navigate = useNavigate();
  const { toggleCart, cartCount } = useCart();
  const { handlesearch, clearSearch } = useSearch();
  const { searchResults, isSearching } = useSelector((state) => state.search);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (showSearchBox) {
      searchInputRef.current?.focus();
    }
  }, [showSearchBox]);

  const handleLogoClick = () => {
    if (setActiveCategory) setActiveCategory('All');
    navigate('/dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (category) => {
    if (setActiveCategory) setActiveCategory(category);
    setIsMobileMenuOpen(false);
    navigate('/dashboard');
    setTimeout(() => {
      const element = document.getElementById('storefront');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
      }
    }, 120);
  };

  const handleSearchToggle = () => {
    const nextState = !showSearchBox;
    setShowSearchBox(nextState);
    if (!nextState) {
      setSearchInput('');
      clearSearch();
    }
  };

  const handleSearchInput = (event) => {
    const query = event.target.value;
    setSearchInput(query);
    if (!query.trim()) {
      clearSearch();
      return;
    }
    handlesearch(query);
  };

  const handleResultClick = (productId) => {
    navigate(`/product/${productId}`);
    setShowSearchBox(false);
    setSearchInput('');
    clearSearch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getResultImage = (product) => {
    const images = Array.isArray(product?.image)
      ? product.image
      : Array.isArray(product?.images)
        ? product.images
        : [];
    return images[0] || 'https://placehold.co/120x140';
  };

  const navItems = ['All', 'T-Shirts', 'Hoodies', 'Cargos'];
  const navLabels = { All: 'Shop All', 'T-Shirts': 'T-Shirts', Hoodies: 'Hoodies', Cargos: 'Cargos' };

  return (
    <>
      <nav className={`navbar glass-panel ${isScrolled ? 'scrolled' : ''}`}>
        {/* Logo */}
        <div className="nav-logo" onClick={handleLogoClick}>
          Highkeytees<span>clct</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="nav-links">
          {navItems.map((cat) => (
            <button
              key={cat}
              className={`hover-skew-effect ${activeCategory === cat ? 'active-link' : ''}`}
              onClick={() => handleNavClick(cat)}
              style={{
                fontWeight: activeCategory === cat ? '700' : '500',
                color: activeCategory === cat ? '#4e3629' : '',
              }}
            >
              {navLabels[cat]}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="nav-actions">
          {/* Search Shell */}
          <div className={`search-shell ${showSearchBox ? 'open' : ''}`}>
            <button className="icon-btn" aria-label="Search" onClick={handleSearchToggle}>
              <Search size={20} />
            </button>
            {showSearchBox && (
              <div className="search-input-wrap">
                <Search size={16} className="search-inline-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchInput}
                  onChange={handleSearchInput}
                  placeholder="Search products"
                  aria-label="Search products"
                />
              </div>
            )}
          </div>

          <Link to="/" className="icon-btn" aria-label="Account">
            <User size={20} />
          </Link>

          <button className="icon-btn" onClick={toggleCart} aria-label="Shopping Bag">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* Animated Hamburger Button */}
          <button
            className={`hamburger-btn ${isMobileMenuOpen ? 'is-open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="ham-line ham-line--top" />
            <span className="ham-line ham-line--mid" />
            <span className="ham-line ham-line--bot" />
          </button>
        </div>
      </nav>

      {/* Search Results Panel */}
      {showSearchBox && (
        <div className="search-results-panel glass-panel">
          {isSearching ? (
            <div className="search-status">Searching...</div>
          ) : searchInput.trim() && searchResults.length === 0 ? (
            <div className="search-status">No products found.</div>
          ) : !searchInput.trim() ? (
            <div className="search-status">Search for a product title or description.</div>
          ) : (
            searchResults.map((product) => (
              <button
                key={product._id || product.id}
                className="search-result-item"
                onClick={() => handleResultClick(product._id || product.id)}
              >
                <img src={getResultImage(product)} alt={product.title} />
                <div className="search-result-copy">
                  <h4>{product.title}</h4>
                  <p>{product.description}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-nav-overlay ${isMobileMenuOpen ? 'overlay-visible' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer */}
      <div className={`mobile-nav-drawer glass-panel ${isMobileMenuOpen ? 'drawer-open' : ''}`}>
        <div className="mobile-nav-inner">
          <p className="mobile-nav-label">Navigation</p>
          <nav className="mobile-nav-links">
            {navItems.map((cat, i) => (
              <button
                key={cat}
                className={`mobile-nav-item ${activeCategory === cat ? 'mobile-nav-item--active' : ''}`}
                onClick={() => handleNavClick(cat)}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span>{navLabels[cat]}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </nav>

          <div className="mobile-nav-footer">
            <Link to="/" className="mobile-footer-link" onClick={() => setIsMobileMenuOpen(false)}>
              <User size={18} />
              <span>My Account</span>
            </Link>
            <button className="mobile-footer-link" onClick={() => { toggleCart(); setIsMobileMenuOpen(false); }}>
              <ShoppingBag size={18} />
              <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
