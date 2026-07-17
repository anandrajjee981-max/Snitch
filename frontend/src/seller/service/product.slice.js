import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addproduct: (state, action) => {
      state.products.push(action.payload);
    },
  },
});

export const { addproduct } = productSlice.actions;
export default productSlice.reducer;
