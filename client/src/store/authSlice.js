import { createSlice } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: true,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setUser, setToken, logout, setLoading, setError } = authSlice.actions;

// Async thunk for initializing app
export const initializeApp = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token by fetching user profile
      dispatch(setLoading(true));
      // TODO: Fetch user profile
    }
  } catch (error) {
    console.error('Initialization error:', error);
    dispatch(logout());
  } finally {
    dispatch(setLoading(false));
  }
};

export default authSlice.reducer;
