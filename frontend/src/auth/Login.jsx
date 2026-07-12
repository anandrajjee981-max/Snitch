import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Globe } from 'lucide-react';
import gsap from 'gsap';
import useauth from './hook/UseAuth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const inputsRef = useRef([]);
  const{handlelogin} = useauth()

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill out all fields.');
      return;
    }
    const res = await handlelogin(email, password);
    if (res && res.success) {
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google auth endpoint which will handle the OAuth flow
    const BACKEND = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
    window.location.href = `${BACKEND}/api/auth/google`;
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card glass-panel" ref={cardRef}>
        <div className="auth-header">
          <span className="auth-tag">Welcome Back</span>
          <h2 className="auth-title" ref={titleRef}>Sign In to AURA</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email Input */}
          <div 
            className="auth-input-group" 
            ref={(el) => (inputsRef.current[0] = el)}
          >
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                autoComplete="new-email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div 
            className="auth-input-group" 
            ref={(el) => (inputsRef.current[1] = el)}
          >
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <Link to="/login" className="forgot-password-link">Forgot?</Link>
            </div>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                autoComplete="new-password" 
                placeholder="••••••••"
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
            ref={(el) => (inputsRef.current[2] = el)}
          >
            <span>Sign In</span>
            <ArrowRight size={18} />
          </button>

          {/* Divider */}
          <div 
            className="auth-divider"
            ref={(el) => (inputsRef.current[3] = el)}
          >
            <span>or continue with</span>
          </div>

          {/* Google Auth Button */}
          <button
            type="button"
            className="btn-auth-social"
            onClick={handleGoogleLogin}
            ref={(el) => (inputsRef.current[4] = el)}
          >
            <Globe size={18} />
            <span>Open with Google</span>
          </button>
        </form>

        <div className="auth-footer" ref={(el) => (inputsRef.current[5] = el)}>
          <span>New to AURA?</span>
          <Link to="/register" className="auth-redirect-link">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
