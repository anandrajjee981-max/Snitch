import React, { useState } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import ProductDetails from './components/ProductDetails';
import Login from './auth/Login';
import Register from './auth/Register';
import Productform from './seller/service/pages/Productform';
import Sellerdashboard from './seller/service/pages/Seller.dashboard';
import SellerProduct from './seller/service/pages/SellerProduct';
import Protected from './components/Protected';
import Dashboard from './buyer/a';

// Layout that contains persistent Navbar and CartDrawer for the storefront experience
const StorefrontLayout = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <>
      <Navbar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <CartDrawer />
      <div className="main-content-layout">
        <Outlet context={[activeCategory, setActiveCategory]} />
      </div>
    </>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    element: <StorefrontLayout />,
    children: [
      {
        path: "/dashboard",
        element: (
          <Protected role="buyer">
            <Dashboard />
          </Protected>
        )
      },
      {
        path: "/product/:id",
        element: (
          <Protected role="buyer">
            <ProductDetails />
          </Protected>
        )
      }
    ]
  },
  {
    path: "/sellerform",
    element: (
      <Protected role="seller">
        <Productform />
      </Protected>
    )
  },
  {
    path: "/sellerdashboard",
    element: (
      <Protected role="seller">
        <Sellerdashboard />
      </Protected>
    )
  },
  {
    path: "/sellerproduct",
    element: (
      <Protected role="seller">
        <SellerProduct />
      </Protected>
    )
  }
]);
