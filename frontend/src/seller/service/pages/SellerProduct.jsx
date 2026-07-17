import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import '../../../styles/product.scss';
import useproduct from '../hooks/useproduct';

// 📸 Ek chota reusable Sub-Component jisme slider logic hai
const ProductCard = ({ item }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const images = item.image && item.image.length > 0 ? item.image : ['https://via.placeholder.com/300'];
  const mainImage = images[currentImgIndex];

  // Agli image par jaane ke liye (Optional: click on image to slide)
  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }
  };

  return (
    <div className="product-card">
      {/* Media Wrapper */}
      <div className="product-img-box" onClick={nextImage} style={{ cursor: images.length > 1 ? 'pointer' : 'default' }}>
        <img 
          src={mainImage} 
          alt={item.title} 
          loading="lazy" 
          style={{ transition: 'all 0.3s ease-in-out' }} // Smooth image change effect
        />
        
        <span className="currency-badge">
          {item.productprice?.currency === 'INR' ? '₹' : item.productprice?.currency || '$'}
          {item.productprice?.price || 0}
        </span>
        
        {/* Navigation Dots */}
        {images.length > 1 && (
          <div className="image-dots" onClick={(e) => e.stopPropagation()}> {/* Stop propagation taaki image click trigger na ho */}
            {images.map((_, i) => (
              <span 
                key={i} 
                className={`dot ${i === currentImgIndex ? 'active' : ''}`}
                onClick={() => setCurrentImgIndex(i)} // Dot par click karne se image change hogi!
                style={{ cursor: 'pointer' }}
              ></span>
            ))}
          </div>
        )}
      </div>

      {/* Data Specifications Wrapper */}
      <div className="product-info-box">
        <div className="text-content">
          <h3 className="product-title">{item.title}</h3>
          <p className="product-desc">{item.description}</p>
        </div>

        {/* Operations Layer */}
        <div className="card-actions">
          <button className="edit-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
          <button className="delete-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};


// 🏢 Main Component
const SellerProduct = () => {
  const { handlegetproduct } = useproduct();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    const fetchLiveCatalog = async () => {
      try {
        hasFetched.current = true; 
        const res = await handlegetproduct();
        
        if (res && res.products) {
          setProducts(res.products);
        } else if (Array.isArray(res)) {
          setProducts(res);
        }
      } catch (err) {
        console.error("Frontend loading error:", err);
        hasFetched.current = false; 
      } finally {
        setLoading(false);
      }
    };

    fetchLiveCatalog();
  }, [handlegetproduct]);

  // GSAP Entrance Animation
  useEffect(() => {
    if (!loading && products.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.product-card',
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
        );
      }, gridRef);
      return () => ctx.revert();
    }
  }, [loading, products]);

  if (loading) {
    return (
      <div className="product-status-wrapper">
        <div className="spinner"></div>
        <p>Fetching dynamic listings...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-status-wrapper">
        <p className="no-data-msg">Your shop catalog is empty. Add some products!</p>
      </div>
    );
  }

  return (
    <div className="product-section-wrapper" ref={gridRef}>
      <div className="section-header">
        <h2 className="section-title">Store Dashboard</h2>
        <p className="section-subtitle">Real-time control over your online inventory.</p>
      </div>

      <div className="product-grid">
        {products.map((item) => (
          <ProductCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default SellerProduct;