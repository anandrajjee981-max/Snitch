import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Hero from './components/Hero';
﻿import { createBrowserRouter } from 'react-router-dom';
import ProductDetails from './components/ProductDetails';
import Login from './auth/Login';
import Register from './auth/Register';
import Productform from './seller/service/pages/Productform';
import Sellerdashboard from './seller/service/pages/Seller.dashboard';
import SellerProduct from './seller/service/pages/SellerProduct';
import Protected from './components/Protected';

export const router = createBrowserRouter([
 {
       path:"/" ,
          element:<Login />   
 },
{
    path:"/product/:id" ,
          element:
              <ProductDetails />
       

},
{
       path:"/register" ,
          element:
  
              <Register />

          
},
{
       path:"/sellerform" ,
          element:
             <Protected role="seller">
       
            <Productform/>
     
             </Protected>
},
{
        path:"/sellerdashboard",
          element:
               <Protected role="seller">  <Sellerdashboard/></Protected>

},
{
        path:"/sellerdashboard" ,
          element:
               <Protected role="seller">  <Sellerdashboard/></Protected>
         
  
}
  

   
  
])
