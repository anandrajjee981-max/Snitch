import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

// Official Google brand-compliant "G" logo
const GoogleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);
import gsap from 'gsap';
import useauth from './hook/UseAuth';
import Navbar from '../components/Navbar';

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
    const userRole = res?.data?.user?.role || res?.res?.user?.role;

    if (res && res.success) {
      if (userRole?.toLowerCase() === 'seller') {
        navigate('/sellerdashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google auth endpoint which will handle the OAuth flow
    const BACKEND = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
    window.location.href = `${BACKEND}/api/auth/google`;
  };

  return (
    <div className="auth-page-container">
      <Navbar/>
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
            className="btn-auth-social btn-google"
            onClick={handleGoogleLogin}
            ref={(el) => (inputsRef.current[4] = el)}
          >
            <GoogleIcon />
            <span>Continue with Google</span>
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
