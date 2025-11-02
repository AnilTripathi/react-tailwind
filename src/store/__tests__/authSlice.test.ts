/**
 * Auth slice tests
 * Tests for refreshToken handling in authentication state
 */

import { authSlice, loginSuccess, tokenRefreshed, logout } from '../authSlice';
import type { AuthState } from '../../types/auth';

describe('authSlice', () => {
  const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  it('should handle loginSuccess with both tokens', () => {
    const action = loginSuccess({
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-456',
    });
    
    const state = authSlice.reducer(initialState, action);
    
    expect(state.accessToken).toBe('access-token-123');
    expect(state.refreshToken).toBe('refresh-token-456');
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle tokenRefreshed with new access token', () => {
    const currentState: AuthState = {
      ...initialState,
      accessToken: 'old-access-token',
      refreshToken: 'current-refresh-token',
      isAuthenticated: true,
    };

    const action = tokenRefreshed({
      accessToken: 'new-access-token',
    });
    
    const state = authSlice.reducer(currentState, action);
    
    expect(state.accessToken).toBe('new-access-token');
    expect(state.refreshToken).toBe('current-refresh-token'); // Should remain unchanged
    expect(state.isAuthenticated).toBe(true);
  });

  it('should handle tokenRefreshed with rotated refresh token', () => {
    const currentState: AuthState = {
      ...initialState,
      accessToken: 'old-access-token',
      refreshToken: 'old-refresh-token',
      isAuthenticated: true,
    };

    const action = tokenRefreshed({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
    
    const state = authSlice.reducer(currentState, action);
    
    expect(state.accessToken).toBe('new-access-token');
    expect(state.refreshToken).toBe('new-refresh-token');
    expect(state.isAuthenticated).toBe(true);
  });

  it('should handle logout and clear both tokens', () => {
    const authenticatedState: AuthState = {
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-456',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };

    const state = authSlice.reducer(authenticatedState, logout());
    
    expect(state.accessToken).toBe(null);
    expect(state.refreshToken).toBe(null);
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });
});