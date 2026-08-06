import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  isCartOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setcart: (state, action) => {
      state.cart = action.payload;
    },
    addtocarts: (state, action) => {
      state.cart = action.payload;
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

export const { setcart, addtocarts, toggleCart, closeCart, openCart } = cartSlice.actions;
export default cartSlice.reducer;

