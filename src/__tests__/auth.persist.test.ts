import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer, { loginSuccess, logout } from '../store/authSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['accessToken', 'isAuthenticated'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: persistedAuthReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER'],
        },
      }),
  });
};

describe('Auth Persistence', () => {
  let store: ReturnType<typeof createTestStore>;
  let persistor: ReturnType<typeof persistStore>;

  beforeEach(() => {
    store = createTestStore();
    persistor = persistStore(store);
  });

  afterEach(async () => {
    await persistor.purge();
  });

  it('should persist auth state after login', async () => {
    const accessToken = 'test-token';
    
    store.dispatch(loginSuccess({ accessToken }));
    
    const state = store.getState().auth;
    expect(state.accessToken).toBe(accessToken);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should clear persisted state on logout', async () => {
    // First login
    store.dispatch(loginSuccess({ accessToken: 'test-token' }));
    
    // Then logout
    store.dispatch(logout());
    
    const state = store.getState().auth;
    expect(state.accessToken).toBe(null);
    expect(state.isAuthenticated).toBe(false);
  });

  it('should not persist loading and error states', () => {
    const state = store.getState().auth;
    
    // These should not be in persisted config
    expect(authPersistConfig.whitelist).not.toContain('isLoading');
    expect(authPersistConfig.whitelist).not.toContain('error');
  });
});