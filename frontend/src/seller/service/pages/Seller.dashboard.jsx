import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import '../../../styles/dashboard.scss';

const Sellerdashboard = () => {
  const navigate = useNavigate();
  const dashboardRef = useRef(null);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dashboard-header',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.dashboard-card',
        { opacity: 0, scale: 0.95, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power4.out', delay: 0.1 }
      );
    }, dashboardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="dashboard-wrapper" ref={dashboardRef}>
      <div className="dashboard-container">
        
        {/* Header Block */}
        <header className="dashboard-header">
          <h1 className="dashboard-title">Seller Hub</h1>
          <p className="dashboard-subtitle">Manage your creations and list new masterpieces instantly.</p>
        </header>

        {/* Dynamic Action Cards */}
        <div className="dashboard-grid">
          
          {/* Action 1: Submit Product */}
          <div 
            className="dashboard-card action-submit"
            onClick={() => navigate('/sellerform')}
          >
            <div className="card-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <div className="card-content">
              <h3>Submit Product</h3>
              <p>Create a beautiful listing with up to 7 images, local currency, and custom titles.</p>
            </div>
            <span className="card-action-btn">List Now &rarr;</span>
          </div>

          {/* Action 2: My Products */}
          <div 
            className="dashboard-card action-inventory"
            onClick={() => navigate('/my-products')} // Apne route ke hisab se modify kar sakte ho
          >
            <div className="card-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div className="card-content">
              <h3>My Products</h3>
              <p>Track your active inventory, edit descriptions, change pricing, and monitor views.</p>
            </div>
            <span className="card-action-btn">View Store &rarr;</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Sellerdashboard;