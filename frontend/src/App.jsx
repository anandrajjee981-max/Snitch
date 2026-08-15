import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { router } from './routes';
import useauth from './auth/hook/UseAuth';

export default function App() {
  const auth = useauth();
  const loading = useSelector((state) => state.auth?.loading);
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    auth.handlegetme();
  }, []);

  if (loading && !user) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading account...</div>;
  }

  return <RouterProvider router={router} />;
}
