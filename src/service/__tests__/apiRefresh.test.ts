/**
 * API refresh flow integration tests
 * Tests automatic token refresh on 401 responses
 */

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { configureStore } from '@reduxjs/toolkit';
import { appAPI } from '../api';
import { authSlice } from '../../store/authSlice';
import { ENDPOINTS } from '../../constants/endpoints';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const createTestStore = (initialAuthState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
      [appAPI.reducerPath]: appAPI.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(appAPI.middleware),
    preloadedState: {
      auth: {
        accessToken: 'expired-token',
        refreshToken: 'valid-refresh-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
        ...initialAuthState,
      },
    },
  });
};

describe('API refresh flow', () => {
  it('should refresh token on 401 and retry original request', async () => {
    let requestCount = 0;
    
    server.use(
      // First request fails with 401
      rest.get(`${ENDPOINTS.BASE_URL}/protected-endpoint`, (req, res, ctx) => {
        requestCount++;
        if (requestCount === 1) {
          return res(ctx.status(401), ctx.json({ message: 'Token expired' }));
        }
        // Second request succeeds after refresh
        return res(ctx.json({ data: 'success' }));
      }),
      
      // Refresh endpoint succeeds
      rest.post(`${ENDPOINTS.BASE_URL}${ENDPOINTS.AUTH.REFRESH}`, async (req, res, ctx) => {
        const body = await req.json();
        // Verify new request body format
        expect(body).toEqual({
          accessToken: 'expired-token',
          refreshToken: 'valid-refresh-token',
        });
        
        return res(ctx.json({
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
          expiresIn: 3600,
        }));
      })
    );

    const store = createTestStore();
    
    // Make a request that will trigger 401 -> refresh -> retry
    const result = await store.dispatch(
      appAPI.endpoints.getUserTasks.initiate({ page: 0, size: 10, sort: 'dueAt,asc' })
    );

    expect(requestCount).toBe(2); // Original request + retry after refresh
    expect(store.getState().auth.accessToken).toBe('new-access-token');
    expect(store.getState().auth.refreshToken).toBe('new-refresh-token');
  });

  it('should logout when refresh token is invalid', async () => {
    server.use(
      // Protected endpoint returns 401
      rest.get(`${ENDPOINTS.BASE_URL}/protected-endpoint`, (req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ message: 'Token expired' }));
      }),
      
      // Refresh endpoint fails
      rest.post(`${ENDPOINTS.BASE_URL}${ENDPOINTS.AUTH.REFRESH}`, async (req, res, ctx) => {
        const body = await req.json();
        // Verify request body format even on failure
        expect(body).toHaveProperty('accessToken');
        expect(body).toHaveProperty('refreshToken');
        
        return res(ctx.status(401), ctx.json({ message: 'Refresh token expired' }));
      })
    );

    const store = createTestStore();
    
    // Make a request that will trigger 401 -> failed refresh -> logout
    await store.dispatch(
      appAPI.endpoints.getUserTasks.initiate({ page: 0, size: 10, sort: 'dueAt,asc' })
    );

    // Should be logged out
    expect(store.getState().auth.accessToken).toBe(null);
    expect(store.getState().auth.refreshToken).toBe(null);
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });

  it('should logout when no refresh token available', async () => {
    server.use(
      rest.get(`${ENDPOINTS.BASE_URL}/protected-endpoint`, (req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ message: 'Token expired' }));
      })
    );

    const store = createTestStore({ refreshToken: null });
    
    await store.dispatch(
      appAPI.endpoints.getUserTasks.initiate({ page: 0, size: 10, sort: 'dueAt,asc' })
    );

    // Should be logged out immediately
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });
});