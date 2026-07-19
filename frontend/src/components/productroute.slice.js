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

export const { addToCart, removeFromCart, updateQuantity, toggleCart, closeCart, openCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const isCartOpen = useSelector((state) => state.cart.isCartOpen);

  const cartTotal = cart.reduce((total, item) => {
    const price = item.productprice?.price || item.price || 0;
    return total + price * item.quantity;
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return {
    cart,
    isCartOpen,
    cartTotal,
    cartCount,
    addToCart: (item) => dispatch(addToCart(item)),
    removeFromCart: (id) => dispatch(removeFromCart(id)),
    updateQuantity: (id, amount) => dispatch(updateQuantity({ id, amount })),
    toggleCart: () => dispatch(toggleCart()),
    closeCart: () => dispatch(closeCart()),
    openCart: () => dispatch(openCart()),
  };
};
