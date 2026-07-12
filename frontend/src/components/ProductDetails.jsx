import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingBag, Heart, Shield, RefreshCw } from 'lucide-react';
import { PRODUCTS } from './ProductGrid';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function ProductDetails({ productId, onBack, onNavigateToProduct }) {
  const { addToCart } = useCart();
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button onClick={onBack} className="btn-secondary" style={{ marginTop: '2rem' }}>
          Back to Shop
        </button>
      </div>
    );
  }

  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : null);
  const [isLiked, setIsLiked] = useState(false);

  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const detailsRef = useRef(null);

  // Stagger details elements entrance using GSAP
  useEffect(() => {
    // Reset selections when product changes
    setSelectedSize(product.sizes ? product.sizes[0] : null);
    setIsLiked(false);

    // Scroll to top of window when view loads
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Clean up previous layouts
      gsap.fromTo(imageRef.current, 
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power4.out' }
      );

      const items = detailsRef.current.children;
      gsap.fromTo(items,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [productId, product]);

  // Recommended products (excluding active product)
  const recommendations = PRODUCTS
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    // Incorporate size details in cart if applicable
    const productToAdd = selectedSize 
      ? { ...product, id: `${product.id}-${selectedSize}`, title: `${product.title} (${selectedSize})` }
      : product;
    addToCart(productToAdd);
  };

  return (
    <motion.div 
      className="product-details-page-wrapper"
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ paddingTop: '120px' }}
    >
      <div className="details-container">
        {/* Back navigation bar */}
        <div className="details-back-nav">
          <button onClick={onBack} className="btn-back">
            <ArrowLeft size={18} />
            <span>Back to collection</span>
          </button>
          <span className="details-breadcrumbs">
            Shop / {product.category} / {product.title}
          </span>
        </div>

        {/* Core details layout */}
        <div className="details-core-grid">
          {/* Visual Presentation */}
          <div className="details-image-zone" ref={imageRef}>
            <div className="image-wrapper has-inset-shadow">
              <img src={product.image} alt={product.title} />
            </div>
          </div>

          {/* Text & Buying Zone */}
          <div className="details-info-zone" ref={detailsRef}>
            <span className="info-category">{product.category}</span>
            <h1 className="info-title">{product.title}</h1>
            <div className="info-price">${product.price.toFixed(2)}</div>
            <p className="info-desc">{product.desc}</p>

            {/* Sizes section (displayed only for Apparel) */}
            {product.sizes && (
              <div className="info-sizes-section">
                <span className="section-title">Select Size</span>
                <div className="sizes-selector-grid">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-pill ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA purchase block */}
            <div className="info-buying-actions">
              <button className="btn-purchase-main" onClick={handleAddToCart}>
                <ShoppingBag size={20} />
                <span>Add to Bag</span>
              </button>
              <button 
                className={`btn-wishlist ${isLiked ? 'liked' : ''}`} 
                onClick={() => setIsLiked(!isLiked)}
                aria-label="Add to wishlist"
              >
                <Heart size={20} fill={isLiked ? '#4e3629' : 'none'} />
              </button>
            </div>

            {/* Core trust notes */}
            <div className="info-trust-notes">
              <div className="note">
                <Shield size={16} />
                <span>Sustainably and ethically sourced materials.</span>
              </div>
              <div className="note">
                <RefreshCw size={16} />
                <span>Complimentary 30-day returns and exchanges.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products (Cross-sell grid) */}
        {recommendations.length > 0 && (
          <div className="details-recommendations">
            <h3 className="rec-title">Complete your routine</h3>
            <div className="rec-grid">
              {recommendations.map((rec) => (
                <div 
                  key={rec.id} 
                  className="rec-card glass-panel"
                  onClick={() => onNavigateToProduct(rec.id)}
                >
                  <div className="rec-card-image">
                    <img src={rec.image} alt={rec.title} />
                  </div>
                  <div className="rec-card-info">
                    <h4>{rec.title}</h4>
                    <span className="price">${rec.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
