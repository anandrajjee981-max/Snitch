import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import gsap from 'gsap';
import Lenis from 'lenis';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import useproduct from '../seller/service/hooks/useproduct';
import { Search } from 'lucide-react';

export default function BuyerDashboard() {
  // Read shared category state from Outlet layout context
  const [activeCategory, setActiveCategory] = useOutletContext() || useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { handleuserproduct } = useproduct();
  const products = useSelector((state) => state.products.userallproduct);
  const [loading, setLoading] = useState(products.length === 0);

  const storefrontRef = useRef(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Fetch dynamic products from backend
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        await handleuserproduct();
      } catch (err) {
        console.error("Error loading products on buyer dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [handleuserproduct]);

  // Filter products based on search and category
  const filteredProducts = products.filter((item) => {
    // Normalization helper (removes hyphens, spaces, and lowercase)
    const normalize = (str) => str?.toLowerCase().replace(/[\s-]/g, '') || '';
    
    // Default categories fallbacks (if item category is empty, default it to T-Shirts)
    const itemCategory = item.category ? normalize(item.category) : 'tshirts';
    const selectedCategory = normalize(activeCategory);

    const matchesCategory = selectedCategory === 'all' || itemCategory === selectedCategory;

    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Staggered card entrance animation
  useEffect(() => {
    if (!loading && filteredProducts.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.product-card-container',
          { opacity: 0, y: 60, scale: 0.98 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.8, 
            stagger: 0.08, 
            ease: 'power3.out',
            clearProps: 'all'
          }
        );
      }, storefrontRef);
      return () => ctx.revert();
    }
  }, [loading, filteredProducts.length, activeCategory]);

  return (
    <div className="buyer-dashboard-wrapper">
      {/* Premium Hero section */}
      <Hero />

      {/* Main product storefront */}
      <section className="storefront-section" id="storefront" ref={storefrontRef}>
        <div className="storefront-header">
          <div className="title-block">
            <span className="section-tag">Streetwear Drop</span>
            <h2 className="section-title">New Season Arrivals</h2>
            <p className="section-subtitle">Heavy-weight oversized fits, premium street fabrics, and bold aesthetic silhouettes. Get the drop before it's gone.</p>
          </div>

          <div className="controls-block">
            {/* Elegant Search bar */}
            <div className="search-bar-wrapper">
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                placeholder="Search collection..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category pills */}
            <div className="category-pills">
              {['All', 'T-Shirts', 'Hoodies', 'Cargos'].map((cat) => (
                <button
                  key={cat}
                  className={`pill-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic products list grid */}
        {loading ? (
          <div className="catalog-status-wrapper">
            <div className="spinner"></div>
            <p>Gathering seasonal selection...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="catalog-status-wrapper">
            <p className="empty-msg">No pieces found matching your criteria.</p>
          </div>
        ) : (
          <div className="product-grid-catalog">
            {filteredProducts.map((item) => (
              <ProductCard key={item._id || item.id} product={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
