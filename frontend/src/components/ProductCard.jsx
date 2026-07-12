import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MoreHorizontal, ShoppingCart, Eye, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cardRef = useRef(null);
  const dotsBtnRef = useRef(null);
  const dropdownRef = useRef(null);

  // 3D Tilt Effect on Hover
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;

    // Calculate rotation (-10 to 10 degrees)
    const rotateY = (x / (width / 2)) * 10;
    const rotateX = -(y / (height / 2)) * 10;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      ease: 'power2.out',
      duration: 0.3,
      overwrite: 'auto',
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      ease: 'power3.out',
      duration: 0.5,
      overwrite: 'auto',
    });
  };

  // Dots Button Hover Micro-interaction
  const handleDotsEnter = () => {
    if (!dotsBtnRef.current) return;
    gsap.to(dotsBtnRef.current, {
      scale: 1.15,
      rotate: 90,
      duration: 0.4,
      ease: 'back.out(2)',
    });
  };

  const handleDotsLeave = () => {
    if (!dotsBtnRef.current) return;
    gsap.to(dotsBtnRef.current, {
      scale: 1,
      rotate: 0,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen && 
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !dotsBtnRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleCardClick = (e) => {
    // Prevent navigating if clicking the floating dots button or its dropdown
    if (
      (dotsBtnRef.current && dotsBtnRef.current.contains(e.target)) ||
      (dropdownRef.current && dropdownRef.current.contains(e.target)) ||
      e.target.closest('.btn-add-cart-minimal')
    ) {
      return;
    }
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card-container">
      <div 
        className="product-card"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }}
      >
        <div className="image-zone">
          <img src={product.image} alt={product.title} />

          {/* Three-dots menu container */}
          <button 
            className="ios-dots-btn glass-panel"
            ref={dotsBtnRef}
            onMouseEnter={handleDotsEnter}
            onMouseLeave={handleDotsLeave}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Product options"
          >
            <MoreHorizontal />
          </button>

          {/* iOS Dropdown with Framer Motion AnimatePresence */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                className="ios-dropdown-menu glass-panel"
                ref={dropdownRef}
                initial={{ opacity: 0, scale: 0.85, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -10 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <button 
                  className="dropdown-item" 
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate(`/product/${product.id}`);
                  }}
                >
                  <Eye /> View Details
                </button>
                <button 
                  className="dropdown-item" 
                  onClick={() => {
                    setIsMenuOpen(false);
                    addToCart(product);
                  }}
                >
                  <ShoppingCart /> Add to Cart
                </button>
                <button 
                  className="dropdown-item" 
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigator.clipboard.writeText(`${window.location.origin}/#/product/${product.id}`);
                    alert('Product link copied to clipboard!');
                  }}
                >
                  <Share2 /> Share
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="info-zone">
          <span className="product-category">{product.category}</span>
          <h3 className="product-title">{product.title}</h3>
          
          <div className="product-meta">
            <span className="product-price">${product.price.toFixed(2)}</span>
            <button 
              className="btn-add-cart-minimal"
              onClick={() => addToCart(product)}
            >
              Add +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
