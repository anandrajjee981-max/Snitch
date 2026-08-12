import { createSlice } from '@reduxjs/toolkit';

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
      state.cart = action.payload;
      state.isLoaded = true;
    },
    addtocarts: (state, action) => {
      state.cart = action.payload;
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

