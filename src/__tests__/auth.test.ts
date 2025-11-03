import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  tokenRefreshed,
} from '../store/authSlice';

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

describe('Auth Slice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  it('should handle login start', () => {
    store.dispatch(loginStart());
    const state = store.getState().auth;

    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle login success', () => {
    const accessToken = 'test-token';
    const refreshToken = 'test-refresh-token';
    store.dispatch(loginSuccess({ accessToken, refreshToken }));
    const state = store.getState().auth;

    expect(state.accessToken).toBe(accessToken);
    expect(state.refreshToken).toBe(refreshToken);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle login failure', () => {
    const errorMessage = 'Invalid credentials';
    store.dispatch(loginFailure(errorMessage));
    const state = store.getState().auth;

    expect(state.accessToken).toBe(null);
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should handle token refresh', () => {
    const newToken = 'new-token';
    store.dispatch(tokenRefreshed({ accessToken: newToken }));
    const state = store.getState().auth;

    expect(state.accessToken).toBe(newToken);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should handle logout', () => {
    // First login
    store.dispatch(loginSuccess({ accessToken: 'test-token', refreshToken: 'test-refresh-token' }));

    // Then logout
    store.dispatch(logout());
    const state = store.getState().auth;

    expect(state.accessToken).toBe(null);
    expect(state.refreshToken).toBe(null);
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });
});
