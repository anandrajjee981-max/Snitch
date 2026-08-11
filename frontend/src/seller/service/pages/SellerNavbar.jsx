import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutDashboard, Package, PlusCircle, LogOut, Store } from 'lucide-react';
import '../../../styles/seller-navbar.scss';

const navLinks = [
  {
    to: '/sellerdashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    to: '/sellerproduct',
    label: 'My Products',
    icon: <Package size={18} />,
  },
  {
    to: '/sellerform',
    label: 'Add Product',
    icon: <PlusCircle size={18} />,
  },
];

export default function SellerNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth?.user);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`seller-navbar ${isScrolled ? 'seller-navbar--scrolled' : ''}`}>
        {/* Logo */}
        <button className="seller-nav__logo" onClick={() => navigate('/sellerdashboard')}>
          <Store size={22} strokeWidth={1.8} />
          <span className="seller-nav__logo-text">
          Highkeytees <em>seller</em>
          </span>
        </button>

        {/* Desktop Links */}
        <ul className="seller-nav__links">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`seller-nav__link ${isActive(link.to) ? 'seller-nav__link--active' : ''}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side actions */}
        <div className="seller-nav__actions">
          {user && (
            <div className="seller-nav__user">
              <div className="seller-nav__avatar">
                {(user.name || user.email || 'S')[0].toUpperCase()}
              </div>
              <span className="seller-nav__username">{user.name || user.email || 'Seller'}</span>
            </div>
          )}
          <Link to="/dashboard" className="seller-nav__store-btn">
            <Store size={15} />
            <span>Visit Store</span>
          </Link>

          {/* Animated Hamburger Button */}
          <button
            className={`seller-hamburger ${isMobileMenuOpen ? 'seller-hamburger--open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="seller-ham-line seller-ham-line--top" />
            <span className="seller-ham-line seller-ham-line--mid" />
            <span className="seller-ham-line seller-ham-line--bot" />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`seller-mobile-overlay ${isMobileMenuOpen ? 'seller-mobile-overlay--visible' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div className={`seller-mobile-drawer ${isMobileMenuOpen ? 'seller-mobile-drawer--open' : ''}`}>
        <div className="seller-mobile-drawer__inner">
          {/* User Info in Drawer */}
          {user && (
            <div className="seller-drawer__user">
              <div className="seller-drawer__avatar">
                {(user.name || user.email || 'S')[0].toUpperCase()}
              </div>
              <div className="seller-drawer__user-info">
                <p className="seller-drawer__user-name">{user.name || 'Seller'}</p>
                <p className="seller-drawer__user-email">{user.email || ''}</p>
              </div>
            </div>
          )}

          <p className="seller-drawer__section-label">Menu</p>

          {/* Nav Links */}
          <nav className="seller-drawer__links">
            {navLinks.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                className={`seller-drawer__link ${isActive(link.to) ? 'seller-drawer__link--active' : ''}`}
                style={{ animationDelay: `${i * 55}ms` }}
              >
                <span className="seller-drawer__link-icon">{link.icon}</span>
                <span>{link.label}</span>
                <svg className="seller-drawer__chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="seller-drawer__footer">
            <Link to="/dashboard" className="seller-drawer__footer-link">
              <Store size={16} />
              <span>Visit Store</span>
            </Link>
            <Link to="/" className="seller-drawer__footer-link seller-drawer__footer-link--logout">
              <LogOut size={16} />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
