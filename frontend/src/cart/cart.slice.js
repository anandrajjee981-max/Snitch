import { createSlice } from '@reduxjs/toolkit';

const normalizeCartItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return [];
};

const initialState = {
  cart: [],
  isCartOpen: false,
  isLoaded: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setcart: (state, action) => {
      state.cart = normalizeCartItems(action.payload);
      state.isLoaded = true;
    },
    addtocarts: (state, action) => {
      state.cart = normalizeCartItems(action.payload);
      state.isLoaded = true;
    },
    setcartloaded: (state, action) => {
      state.isLoaded = action.payload;
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

export const { setcart, addtocarts, setcartloaded, toggleCart, closeCart, openCart } = cartSlice.actions;
export default cartSlice.reducer;

