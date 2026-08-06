import { createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

const initialState = {
  cart: [],
  isCartOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const id = item._id || item.id;
      const existingItem = state.cart.find((i) => (i._id || i.id) === id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ ...item, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cart = state.cart.filter((item) => (item._id || item.id) !== id);
    },
    updateQuantity: (state, action) => {
      const { id, amount } = action.payload;
      const item = state.cart.find((i) => (i._id || i.id) === id);
      if (item) {
        item.quantity += amount;
        if (item.quantity <= 0) {
          state.cart = state.cart.filter((i) => (i._id || i.id) !== id);
        }
      }
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
    openCart: (state) => {
      state.isCartOpen = true;
    },
  },
});

import usecart from '../cart/hooks/usecart';

export const { addToCart, removeFromCart, updateQuantity, toggleCart, closeCart, openCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

export const useCart = usecart;

