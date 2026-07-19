import React, { useState } from 'react';
import Navbar from './components/Navbar'


import {router} from './routes'
import { RouterProvider } from 'react-router-dom'

export default function App() {
    const [activeCategory, setActiveCategory] = useState('All');
  return (
  <RouterProvider  router={router}>
  <Navbar 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />
  </RouterProvider>
  );
}
