import { createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

const initialState = {
  searchResults: [],
  isSearching: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
  },
});

export const { setSearchResults, setIsSearching } = searchSlice.actions;
export default searchSlice.reducer;




