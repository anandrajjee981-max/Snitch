import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import AppRoutes from './routes';

function MainApp() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <>
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <AppRoutes
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <CartDrawer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </BrowserRouter>
  );
}
