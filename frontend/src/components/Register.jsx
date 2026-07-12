import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, Globe, ShieldAlert, UserCheck } from 'lucide-react';
import gsap from 'gsap';

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('buyer'); // 'buyer' | 'seller'
  const [password, setPassword] = useState('');

  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const inputsRef = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Staggered entry animation
      gsap.fromTo(cardRef.current, 
        { opacity: 0, y: 40, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power4.out' }
      );

      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.15 }
      );

      gsap.fromTo(inputsRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 0.25 }
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !email || !phone || !password) {
      alert('Please fill out all fields.');
      return;
    }
    alert(`Account created successfully! Welcome, ${username} (${role}).`);
    navigate('/login');
  };

  const handleGoogleSignup = () => {
    alert('Connecting to Google accounts registration...');
    navigate('/');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card glass-panel register-card" ref={cardRef}>
        <div className="auth-header">
          <span className="auth-tag">Get Started</span>
          <h2 className="auth-title" ref={titleRef}>Create Your Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username Input */}
          <div 
            className="auth-input-group" 
            ref={(el) => (inputsRef.current[0] = el)}
          >
            <label htmlFor="username">Full Name / Username</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                id="username"
                type="text"
                placeholder="Aura Collective"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div 
            className="auth-input-group" 
            ref={(el) => (inputsRef.current[1] = el)}
          >
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Phone Number Input */}
          <div 
            className="auth-input-group" 
            ref={(el) => (inputsRef.current[2] = el)}
          >
            <label htmlFor="phone">Phone Number</label>
            <div className="input-wrapper">
              <Phone size={18} className="input-icon" />
              <input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Role Selection Picker */}
          <div 
            className="auth-input-group" 
            ref={(el) => (inputsRef.current[3] = el)}
          >
            <label>Select Role</label>
            <div className="role-selector-flex">
              <button
                type="button"
                className={`role-btn ${role === 'buyer' ? 'active' : ''}`}
                onClick={() => setRole('buyer')}
              >
                <UserCheck size={16} />
                <span>Buyer</span>
              </button>
              <button
                type="button"
                className={`role-btn ${role === 'seller' ? 'active' : ''}`}
                onClick={() => setRole('seller')}
              >
                <ShieldAlert size={16} />
                <span>Seller</span>
              </button>
            </div>
          </div>

          {/* Password Input */}
          <div 
            className="auth-input-group" 
            ref={(el) => (inputsRef.current[4] = el)}
          >
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Action buttons */}
          <button 
            type="submit" 
            className="btn-auth-submit"
            ref={(el) => (inputsRef.current[5] = el)}
          >
            <span>Create Account</span>
            <ArrowRight size={18} />
          </button>

          {/* Divider */}
          <div 
            className="auth-divider"
            ref={(el) => (inputsRef.current[6] = el)}
          >
            <span>or sign up with</span>
          </div>

          {/* Google Auth Button */}
          <button
            type="button"
            className="btn-auth-social"
            onClick={handleGoogleSignup}
            ref={(el) => (inputsRef.current[7] = el)}
          >
            <Globe size={18} />
            <span>Open with Google</span>
          </button>
        </form>

        <div className="auth-footer" ref={(el) => (inputsRef.current[8] = el)}>
          <span>Already have an account?</span>
          <Link to="/login" className="auth-redirect-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
