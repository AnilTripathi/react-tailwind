import { createAsyncThunk } from '@reduxjs/toolkit';
import { logout as logoutAction } from './authSlice';

import { ENDPOINTS } from '../constants/endpoints';

export const logoutThunk = createAsyncThunk(
  'auth/logoutThunk',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Call logout API
      const response = await fetch(`${ENDPOINTS.BASE_URL}/${ENDPOINTS.AUTH.LOGOUT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Token clearing is handled by logout action in Redux state
      
      // Dispatch logout action to clear Redux state
      dispatch(logoutAction());
      
      return response.ok;
    } catch {
      // Even if API fails, clear Redux state
      dispatch(logoutAction());
      return rejectWithValue('Logout failed');
    }
  }
);