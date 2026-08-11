import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth.slice';
import productReducer from './seller/service/product.slice';
import cartReducer from './cart/cart.slice';
import searchReducer from './components/search.slice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    search: searchReducer,
  },
});

export default store;