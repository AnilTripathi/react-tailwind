import { createAsyncThunk } from '@reduxjs/toolkit';
import { logout as logoutAction } from './authSlice';
import { tokenStorage } from '../utils/tokenStorage';
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

      // Clear local storage regardless of API response
      tokenStorage.clear();
      
      // Dispatch logout action to clear Redux state
      dispatch(logoutAction());
      
      return response.ok;
    } catch (error) {
      // Even if API fails, clear local state
      tokenStorage.clear();
      dispatch(logoutAction());
      return rejectWithValue('Logout failed');
    }
  }
);