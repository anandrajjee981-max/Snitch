import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    error: null
}

const authSlice = createSlice({ 
    name: 'auth',
    initialState,
    reducers: {
  authStart: (state) => {
    state.loading = true;
    state.error = null;
  },
  authSuccess: (state, action) => {
    state.loading = false;
    state.isAuthenticated = true;   
    state.user = action.payload.user;
    state.token = action.payload.token;

  },
    authFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  }  



    }
});
export const { authStart, authSuccess, authFailure } = authSlice.actions;
export default authSlice.reducer;














