import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './productroute.slice'; 
import { MoreHorizontal, ShoppingCart, Eye, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import '../styles/productcard.scss';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const cardRef = useRef(null);
  const dotsBtnRef = useRef(null);
  const dropdownRef = useRef(null);

  const productData = product;
  if (!productData) {
    return null;
  }

  // Database structure mapping variables
  const productId = productData._id || productData.id;
  const productTitle = productData.title || 'Untitled Product';
  const productCategory = productData.category || 'Apparel';
  const priceAmount = productData.productprice?.price || productData.price || 0;
  const currencySymbol = productData.productprice?.currency === 'INR' || productData.currency === 'INR' ? '₹' : '$';
  
  // Handle single or multiple images
  const galleryImages = Array.isArray(productData.image) 
    ? productData.image 
    : productData.image 
      ? [productData.image] 
      : ['https://placehold.co/600x600'];
  const activeImage = galleryImages[activeImageIndex] || 'https://placehold.co/600x600';

  // Slider controls
  const handlePrevImage = (e) => {
    e.stopPropagation(); 
    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation(); 
    setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/600x600';
  };

  // 3D Tilt Effect on Hover
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;

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
    if (
      (dotsBtnRef.current && dotsBtnRef.current.contains(e.target)) ||
      (dropdownRef.current && dropdownRef.current.contains(e.target)) ||
      e.target.closest('.btn-add-cart-minimal') || 
      e.target.closest('.image-nav-btn')
    ) {
      return;
    }
    navigate(`/product/${productId}`);
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
          <img src={activeImage} alt={productTitle} onError={handleImageError} />

          {/* Slider controls for multi-image array */}
          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                className="image-nav-btn image-nav-btn-left"
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="image-nav-btn image-nav-btn-right"
                onClick={handleNextImage}
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>

              <div className="image-dots" aria-label="Product image gallery">
                {galleryImages.map((_, index) => (
                  <button
                    key={`${productId}-${index}`}
                    type="button"
                    className={`dot ${index === activeImageIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(index);
                    }}
                    aria-label={`Show image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Options button */}
          <button 
            className="ios-dots-btn glass-panel"
            ref={dotsBtnRef}
            onMouseEnter={handleDotsEnter}
            onMouseLeave={handleDotsLeave}
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-label="Product options"
          >
            <MoreHorizontal size={18} />
          </button>

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
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    navigate(`/product/${productId}`);
                  }}
                >
                  <Eye size={16} /> View Details
                </button>
                <button 
                  className="dropdown-item" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    addToCart(productData);
                  }}
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>
                <button 
                  className="dropdown-item" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    navigator.clipboard.writeText(`${window.location.origin}/product/${productId}`);
                    alert('Product link copied to clipboard!');
                  }}
                >
                  <Share2 size={16} /> Share
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="info-zone">
          <span className="product-category">{productCategory}</span>
          <h3 className="product-title">{productTitle}</h3>
          
          <div className="product-meta">
            <span className="product-price">
              {currencySymbol}{priceAmount.toLocaleString()}
            </span>
            <button 
              className="btn-add-cart-minimal"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(productData);
              }}
            >
              Add +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}