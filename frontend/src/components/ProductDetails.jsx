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
  useEffect(()=>{
    console.log(products);
    
  },[])

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

  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const hasVariants = variants.length > 0;

  // null = no variant selected → show base product; a number = show that variant
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isLiked, setIsLiked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const detailsRef = useRef(null);

  // Reset to base product (no variant) whenever we navigate to a different product
  useEffect(() => {
    setSelectedVariantIndex(null);
    setActiveImageIndex(0);
  }, [productId]);

  // Entrance animation
  useEffect(() => {
    if (!product) return;
    
    setIsLiked(false);
    setActiveImageIndex(0);
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

  const activeVariant = (hasVariants && selectedVariantIndex !== null && variants[selectedVariantIndex])
    ? variants[selectedVariantIndex]
    : null;

  // Extract gallery images for active variant or fallback to base product images
  let variantImageUrls = [];
  if (activeVariant && Array.isArray(activeVariant.images) && activeVariant.images.length > 0) {
    variantImageUrls = activeVariant.images
      .map(img => {
        if (typeof img === 'string') return img;
        return img?.url || img?.secure_url || img?.image || '';
      })
      .filter(Boolean);
  }

  const galleryImages = variantImageUrls.length > 0 
    ? variantImageUrls 
    : Array.isArray(product.image) 
      ? product.image 
      : product.image 
        ? [product.image] 
        : ['https://placehold.co/600x600'];

  const mainImage = galleryImages[activeImageIndex] || galleryImages[0] || 'https://placehold.co/600x600';

  // Dynamic price & currency calculation
  const currentPriceObj = activeVariant?.productprice || product.productprice;
  const priceAmount = currentPriceObj?.price !== undefined ? currentPriceObj.price : (product.price || 0);
  const currencySymbol = (currentPriceObj?.currency === 'INR' || product.currency === 'INR') ? '₹' : '$';

  // Dynamic stock check
  const isOutOfStock = activeVariant ? (activeVariant.stock <= 0) : false;

  // Helper to extract variant label (e.g. Size: XL)
  const getVariantLabel = (v) => {
    if (!v || !v.attribute) return 'Option';
    let attr = v.attribute;
    if (attr instanceof Map) {
      attr = Object.fromEntries(attr);
    }
    if (typeof attr === 'object') {
      const entries = Object.entries(attr);
      if (entries.length > 0) {
        return entries.map(([k, val]) => `${k}: ${val}`).join(' | ');
      }
    }
    return 'Option';
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      alert("Selected variant is currently out of stock!");
      return;
    }

    if (activeVariant) {
      const label = getVariantLabel(activeVariant);
      const variantId = activeVariant._id || selectedVariantIndex;
      const cartItem = {
        ...product,
        id: `${product._id || product.id}-${variantId}`,
        _id: `${product._id || product.id}-${variantId}`,
        title: `${product.title} (${label})`,
        productprice: activeVariant.productprice || product.productprice,
        price: priceAmount,
        currency: currentPriceObj?.currency || 'INR',
        image: galleryImages[0],
        selectedVariant: activeVariant
      };
      addToCart(cartItem);
    } else {
      const productToAdd = selectedSize 
        ? { ...product, id: `${product._id || product.id}-${selectedSize}`, title: `${product.title} (${selectedSize})` }
        : product;
      addToCart(productToAdd);
    }
  };

  // Recommended products (excluding active product)
  const recommendations = products
    .filter((p) => p.category === product.category && (p._id || p.id).toString() !== (product._id || product.id).toString())
    .slice(0, 3);

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
            Shop / {product.category || 'Apparel'} / {product.title}
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
            <span className="info-category">{product.category || 'Apparel'}</span>
            <h1 className="info-title">{product.title}</h1>
            <div className="info-price">{currencySymbol}{priceAmount.toLocaleString()}</div>
            <p className="info-desc">{product.description || 'Premium fit tailored with top-tier heavyweight fabrics.'}</p>

            {/* Dynamic Variant Selector or Standard Size Selector */}
            {hasVariants ? (
              <div className="info-sizes-section">
                <span className="section-title">Select Variant</span>
                <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>

                  {/* ── MAIN PRODUCT as first thumbnail (null = base selected) ── */}
                  {(() => {
                    const mainThumb = Array.isArray(product.image) ? product.image[0] : product.image || 'https://placehold.co/100x120';
                    const isSelected = selectedVariantIndex === null;
                    return (
                      <button
                        key="main-product"
                        onClick={() => { setSelectedVariantIndex(null); setActiveImageIndex(0); }}
                        title="Main Product"
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                          padding: '4px', background: 'transparent',
                          border: isSelected ? '2px solid #4e3629' : '2px solid transparent',
                          borderRadius: '10px', cursor: 'pointer',
                          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                          boxShadow: isSelected ? '0 0 0 1px #4e3629' : 'none',
                        }}
                      >
                        <div style={{ width: '64px', height: '80px', borderRadius: '7px', overflow: 'hidden', background: '#f3f3f1', border: '1px solid #e2ddd8' }}>
                          <img src={mainThumb} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 600,
                          color: isSelected ? '#4e3629' : '#666',
                          textAlign: 'center', maxWidth: '64px',
                          lineHeight: 1.2, overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>Default</span>
                      </button>
                    );
                  })()}

                  {/* ── EACH VARIANT thumbnail ── */}
                  {variants.map((v, idx) => {
                    const label = getVariantLabel(v);
                    const isSelected = selectedVariantIndex === idx;
                    const isStockOut = v.stock <= 0;

                    let vThumb = null;
                    if (Array.isArray(v.images) && v.images.length > 0) {
                      const imgObj = v.images[0];
                      vThumb = typeof imgObj === 'string' ? imgObj : (imgObj?.url || imgObj?.secure_url || '');
                    }
                    if (!vThumb) {
                      vThumb = Array.isArray(product.image) ? product.image[0] : product.image || 'https://placehold.co/100x120';
                    }

                    return (
                      <button
                        key={v._id || idx}
                        onClick={() => { if (!isStockOut) { setSelectedVariantIndex(idx); setActiveImageIndex(0); } }}
                        disabled={isStockOut}
                        title={isStockOut ? 'Out of Stock' : label}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                          padding: '4px', background: 'transparent',
                          border: isSelected ? '2px solid #4e3629' : '2px solid transparent',
                          borderRadius: '10px',
                          cursor: isStockOut ? 'not-allowed' : 'pointer',
                          opacity: isStockOut ? 0.4 : 1,
                          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                          boxShadow: isSelected ? '0 0 0 1px #4e3629' : 'none',
                        }}
                      >
                        <div style={{ width: '64px', height: '80px', borderRadius: '7px', overflow: 'hidden', background: '#f3f3f1', border: '1px solid #e2ddd8' }}>
                          <img src={vThumb} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 600,
                          color: isSelected ? '#4e3629' : '#666',
                          textAlign: 'center', maxWidth: '64px',
                          lineHeight: 1.2, overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {isStockOut ? '✕ Sold' : label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
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
            )}

            {/* CTA purchase block */}
            <div className="info-buying-actions">
              <button 
                className="btn-purchase-main" 
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                style={{ opacity: isOutOfStock ? 0.6 : 1, cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
              >
                <ShoppingBag size={20} />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
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
