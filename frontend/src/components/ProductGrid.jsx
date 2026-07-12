import React, { useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  {
    id: 1,
    title: 'Hydrating Face Serum',
    category: 'Skincare',
    price: 48.00,
    image: '/face_serum.png',
    desc: 'An advanced formula with active hyaluronic acid, soothing botanicals, and niacinamide to deeply hydrate and plump your skin for a youthful glow.'
  },
  {
    id: 2,
    title: 'Minimalist Clay Mask',
    category: 'Skincare',
    price: 42.00,
    image: '/clay_mask.png',
    desc: 'Crafted with premium Kaolin clay and calming chamomile extract, this purifying mask clears impurities and refines skin texture without drying.'
  },
  {
    id: 3,
    title: 'Botanical Body Oil',
    category: 'Skincare',
    price: 56.00,
    image: '/body_oil.png',
    desc: 'A luxury blend of cold-pressed rosehip seed, jojoba, and jasmine oils that melts into the skin to deliver long-lasting nourishment and satin finish.'
  },
  {
    id: 4,
    title: 'Gentle Cream Cleanser',
    category: 'Skincare',
    price: 35.00,
    image: '/cream_cleanser.png',
    desc: 'A non-foaming cream cleanser that gently melts away makeup, pollution, and oil while maintaining the skin’s natural lipid barrier.'
  },
  {
    id: 5,
    title: 'Oversized Knit Sweater',
    category: 'Apparel',
    price: 85.00,
    image: '/apparel_sweater.png',
    sizes: ['S', 'M', 'L'],
    desc: 'A luxurious, heavy-knit crewneck sweater woven from organic merino wool. Designed with a modern, relaxed fit and dropped shoulders for ultimate comfort.'
  },
  {
    id: 6,
    title: 'Linen Trench Coat',
    category: 'Apparel',
    price: 120.00,
    image: '/apparel_trench.png',
    sizes: ['S', 'M', 'L', 'XL'],
    desc: 'A versatile, lightweight double-breasted trench coat crafted from 100% Belgian flax linen. Features refined tortoise buttons and a removable waist tie.'
  },
  {
    id: 7,
    title: 'Cotton Loungewear Trousers',
    category: 'Apparel',
    price: 65.00,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop',
    sizes: ['XS', 'S', 'M', 'L'],
    desc: 'Woven trousers constructed from pure, unbleached organic cotton. Features an elasticized drawstring waist and comfortable wide-leg silhouette.'
  },
  {
    id: 8,
    title: 'Silk Slip Dress',
    category: 'Apparel',
    price: 95.00,
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600&auto=format&fit=crop',
    sizes: ['S', 'M', 'L'],
    desc: 'A classic bias-cut slip dress made from sand-washed Mulberry silk. Fluid, lightweight, and finished with delicate adjustable spaghetti straps.'
  }
];

export default function ProductGrid({ onQuickView, activeCategory }) {
  const gridRef = useRef(null);

  // Filter products based on category selection
  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  useEffect(() => {
    const cards = gridRef.current.querySelectorAll('.product-card-container');
    
    // Clear any existing scroll triggers to prevent duplication
    ScrollTrigger.getAll().forEach(t => t.kill());

    const ctx = gsap.context(() => {
      // Clean up previous styles
      gsap.set(cards, { opacity: 0, y: 60, skewY: 4, rotateX: -6 });

      gsap.to(
        cards,
        {
          opacity: 1,
          y: 0,
          skewY: 0,
          rotateX: 0,
          duration: 1.2,
          ease: 'power4.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, [activeCategory]); // Re-run whenever category filters change

  return (
    <section className="storefront-section" id="storefront">
      <div className="section-header">
        <span className="section-tag">Curated Collections</span>
        <h2 className="section-title">The Seasonal Edit</h2>
        <p className="section-desc">
          Timeless apparel silhouettes and clean performance skincare. Formulated and structured for mindful living.
        </p>
      </div>

      <div className="product-grid" ref={gridRef}>
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onNavigateToDetails={onQuickView} 
          />
        ))}
      </div>
    </section>
  );
}
export { PRODUCTS };
