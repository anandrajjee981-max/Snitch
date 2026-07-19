import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  userallproduct: []
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addproduct: (state, action) => {
      state.products.push(action.payload);
    },
    allproductuser: (state, action) => {
      state.userallproduct = Array.isArray(action.payload)
        ? action.payload
        : [];
    }
  },
});

export const { addproduct ,allproductuser} = productSlice.actions;
export default productSlice.reducer;
