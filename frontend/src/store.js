import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth.slice';
import productReducer from './seller/service/product.slice';
import cartReducer from './cart/cart.slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
  },
});

export default store;