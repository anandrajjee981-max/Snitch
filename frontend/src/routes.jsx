import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import ProductDetails from './components/ProductDetails';
import Login from './auth/Login';
import Register from './auth/Register';
import { AnimatePresence, motion } from 'framer-motion';
import Productform from './seller/service/pages/Productform';
import Sellerdashboard from './seller/service/pages/Seller.dashboard';

// Page wrapper for smooth route transitions
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export default function AppRoutes({ activeCategory, setActiveCategory }) {
  const location = useLocation();

  const storePage = (
    <PageWrapper>
      <Hero />
      <ProductGrid activeCategory={activeCategory} />
    </PageWrapper>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          } 
        />
        <Route path="/dashboard" element={storePage} />
        <Route 
          path="/product/:id" 
          element={
            <PageWrapper>
              <ProductDetails />
            </PageWrapper>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          } 
        />
           <Route 
          path="/sellerform" 
          element={
            <PageWrapper>
            <Productform/>
            </PageWrapper>
          } 
        />
             <Route 
          path="/sellerdashboard" 
          element={
           <Sellerdashboard/>
          } 
        />
      </Routes>

    </AnimatePresence>
  );
}
