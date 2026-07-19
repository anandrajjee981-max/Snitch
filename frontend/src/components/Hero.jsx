import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const heroRef = useRef(null);
  const tagRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const actionsRef = useRef(null);
  const mainImgRef = useRef(null);
  const subImgRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro animations
      const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

      tl.fromTo(tagRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, delay: 0.2 })
        .fromTo(titleRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, '-=1')
        .fromTo(descRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, '-=1')
        .fromTo(actionsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, '-=0.9')
        .fromTo(mainImgRef.current, { opacity: 0, scale: 0.95, rotate: -6 }, { opacity: 1, scale: 1, rotate: -3 }, '-=1.2')
        .fromTo(subImgRef.current, { opacity: 0, scale: 0.9, rotate: 12 }, { opacity: 1, scale: 1, rotate: 6 }, '-=1')
        .fromTo(badgeRef.current, { opacity: 0, scale: 0.8, rotate: -10 }, { opacity: 1, scale: 1, rotate: -5 }, '-=1.1');
    }, heroRef);

    return () => ctx.revert(); // cleanup
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-bg-accent"></div>
      
      <div className="hero-content">
        <span className="hero-tag" ref={tagRef}>Street Culture</span>
        <h1 className="hero-title" ref={titleRef}>
          Elevate your vibe with <span>Premium Street</span> fits
        </h1>
        <p className="hero-desc" ref={descRef}>
          Discover our latest streetwear drop featuring heavy-weight cotton hoodies, cargo pants, and drop-shoulder graphic tees. Engineered for street style, built for extreme comfort.
        </p>
        <div className="hero-actions" ref={actionsRef}>
          <a href="#storefront" className="btn-primary">Shop Streetwear</a>
          <a href="#storefront" className="btn-secondary">New Drops</a>
        </div>
      </div>

      <div className="hero-gallery">
        <div className="hero-main-img-wrapper" ref={mainImgRef}>
          <img src="/streetwear_hoodie.png" alt="Premium Oversized Streetwear Hoodie" />
        </div>
        <div className="hero-sub-img-wrapper" ref={subImgRef}>
          <img src="/streetwear_tee.png" alt="Drop Shoulder Graphic Tee" />
        </div>
        <div className="hero-stat-badge glass-panel" ref={badgeRef}>
          <span className="num">100%</span>
          <span className="label">Heavyweight Cotton</span>
        </div>
      </div>
    </section>
  );
}
