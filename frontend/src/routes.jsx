import React, { useState } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartDrawer from './cart/CartDrawer';
import ProductDetails from './components/ProductDetails';
import Login from './auth/Login';
import Register from './auth/Register';
import Productform from './seller/service/pages/Productform';
import Sellerdashboard from './seller/service/pages/Seller.dashboard';
import SellerProduct from './seller/service/pages/SellerProduct';
import Productdetail from './seller/service/pages/Productdetail';
import EditProduct from './seller/service/pages/EditProduct';
import SellerNavbar from './seller/service/pages/SellerNavbar';
import Protected from './components/Protected';
import Dashboard from './buyer/a';
import MyDetails from './components/MyDetails';

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

// Layout for all seller-side pages — persistent SellerNavbar across all seller routes
const SellerLayout = () => {
  return (
    <>
      <SellerNavbar />
      <div className="seller-layout-content">
        <Outlet />
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
             <Dashboard />
        )
      },
      {
        path: "/product/:id",
        element: (
          <ProductDetails />
        )
      },
      {
        path: "/mydetails",
        element: <MyDetails />
      },
      {
        path: "/my-details",
        element: <MyDetails />
      }
    ]
  },
  {
    element: (
      <Protected role="seller">
        <SellerLayout />
      </Protected>
    ),
    children: [
      {
        path: "/sellerdashboard",
        element: <Sellerdashboard />
      },
      {
        path: "/sellerform",
        element: <Productform />
      },
      {
        path: "/sellerproduct",
        element: <SellerProduct />
      },
      {
        path: "/seller/product/:id",
        element: <Productdetail />
      },
      {
        path: "/seller/edit/:id",
        element: <EditProduct />
      }
    ]
  }
]);
