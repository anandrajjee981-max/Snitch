import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ShoppingBag, Heart, Shield, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import gsap from 'gsap';
import { useCart } from './productroute.slice';
import useproduct from '../seller/service/hooks/useproduct';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = id;
  const onBack = () => navigate('/dashboard');
  const onNavigateToProduct = (pid) => navigate(`/product/${pid}`);
  const { addToCart } = useCart();
  const { handleuserproduct } = useproduct();

  const products = useSelector((state) => state.products.userallproduct);
  const [loading, setLoading] = useState(products.length === 0);

  // Fetch products if store is empty
  useEffect(() => {
    const loadProducts = async () => {
      if (products.length === 0) {
        try {
          await handleuserproduct();
        } catch (e) {
          console.error("Failed to load products in details view:", e);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    loadProducts();
  }, [products.length, handleuserproduct]);

  const product = products.find((p) => (p._id || p.id).toString() === productId.toString());

  const [selectedSize, setSelectedSize] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const detailsRef = useRef(null);

  // Stagger details elements entrance using GSAP
  useEffect(() => {
    if (!product) return;
    
    // Reset selections when product changes
    setSelectedSize('M');
    setIsLiked(false);
    setActiveImageIndex(0);

    // Scroll to top of window when view loads
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
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

  if (loading) {
    return (
      <div style={{ padding: '12rem 2rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1.5rem auto' }}></div>
        <h2>Loading product details...</h2>
      </div>
    );
  }

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

  // Recommended products (excluding active product)
  const recommendations = products
    .filter((p) => p.category === product.category && (p._id || p.id).toString() !== (product._id || product.id).toString())
    .slice(0, 3);

  const priceAmount = product.productprice?.price || product.price || 0;
  const currencySymbol = product.productprice?.currency === 'INR' || product.currency === 'INR' ? '₹' : '$';
  
  // Handle multi-image gallery
  const galleryImages = Array.isArray(product.image) 
    ? product.image 
    : product.image 
      ? [product.image] 
      : ['https://placehold.co/600x600'];
  const mainImage = galleryImages[activeImageIndex] || 'https://placehold.co/600x600';

  const handleAddToCart = () => {
    // Incorporate size details in cart if applicable
    const productToAdd = selectedSize 
      ? { ...product, id: `${product._id || product.id}-${selectedSize}`, title: `${product.title} (${selectedSize})` }
      : product;
    addToCart(productToAdd);
  };

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

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
            Shop / {product.category || 'Streetwear'} / {product.title}
          </span>
        </div>

        {/* Core details layout */}
        <div className="details-core-grid">
          {/* Visual Presentation */}
          <div className="details-image-zone">
            {/* Gallery Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="thumbnails-track">
                {galleryImages.map((img, idx) => (
                  <button
                    key={`${productId}-thumb-${idx}`}
                    className={`thumbnail-btn ${idx === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={img} alt={`${product.title} view ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}

            <div className="image-wrapper has-inset-shadow" ref={imageRef}>
              <img src={mainImage} alt={product.title} />
            </div>
          </div>

          {/* Text & Buying Zone */}
          <div className="details-info-zone" ref={detailsRef}>
            <span className="info-category">{product.category || 'Streetwear'}</span>
            <h1 className="info-title">{product.title}</h1>
            <div className="info-price">{currencySymbol}{priceAmount.toLocaleString()}</div>
            <p className="info-desc">{product.description || 'Premium street fit tailored with top-tier heavyweight fabrics.'}</p>

            {/* Sizes section */}
            <div className="info-sizes-section">
              <span className="section-title">Select Size</span>
              <div className="sizes-selector-grid">
                {sizes.map((size) => (
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
                <span>100% Premium Heavyweight Cotton.</span>
              </div>
              <div className="note">
                <RefreshCw size={16} />
                <span>Complimentary 15-day return and exchange dropoff.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        {recommendations.length > 0 && (
          <div className="details-recommendations">
            <h3 className="rec-title">Complete the look</h3>
            <div className="rec-grid">
              {recommendations.map((rec) => {
                const recId = rec._id || rec.id;
                const recPrice = rec.productprice?.price || rec.price || 0;
                const recCurrency = rec.productprice?.currency === 'INR' || rec.currency === 'INR' ? '₹' : '$';
                const recImage = Array.isArray(rec.image) ? rec.image[0] : rec.image;

                return (
                  <div 
                    key={recId} 
                    className="rec-card glass-panel"
                    onClick={() => onNavigateToProduct(recId)}
                  >
                    <div className="rec-card-image">
                      <img src={recImage || 'https://placehold.co/400x400'} alt={rec.title} />
                    </div>
                    <div className="rec-card-info">
                      <h4>{rec.title}</h4>
                      <span className="price">{recCurrency}{recPrice.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
