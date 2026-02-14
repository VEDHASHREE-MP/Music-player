import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: localStorage.getItem('token') || null,
  user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
       setLoading: (state, action) => {
          state.isLoading = action.payload;
          state.error = null;
       } ,
       setUser: (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;

        if (action.payload.token) 
            localStorage.setItem('token', action.payload.token);
    },
    setError: (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
    },
    logout: (state, action) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = null;
        localStorage.removeItem('token');
    },
    updateFavourites: (state, action) => {
        if (state.user) {
            state.user.favourites = Array.isArray(action.payload)
      ? action.payload
      : [];
        }
    },
    clearError: (state) => {
        state.error = null;
    },
}});

export const{setLoading, setUser, setError, logout, updateFavourites, clearError}=authSlice.actions;
export default authSlice.reducer;