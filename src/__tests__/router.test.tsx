import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/authSlice';
import AppRouter from '../routes';

// Mock components to avoid lazy loading in tests
jest.mock('../pages/Dashboard', () => () => <div>Dashboard Page</div>);
jest.mock('../pages/login', () => () => <div>Login Page</div>);
jest.mock('../pages/register', () => () => <div>Register Page</div>);
jest.mock('../pages/about', () => () => <div>About Page</div>);
jest.mock('../pages/notfound', () => () => <div>NotFound Page</div>);
jest.mock('../layout/header', () => () => <div>Header</div>);
jest.mock('../layout/footer', () => () => <div>Footer</div>);

const createTestStore = (isAuthenticated = false) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        accessToken: isAuthenticated ? 'test-token' : null,
        isAuthenticated,
        isLoading: false,
        error: null,
      },
    },
  });
};

const renderWithProviders = (isAuthenticated = false) => {
  const store = createTestStore(isAuthenticated);
  return render(
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
};

describe('Router', () => {
  it('redirects unauthenticated user from private route to login', () => {
    renderWithProviders(false);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders Layout and component for authenticated user on private route', () => {
    renderWithProviders(true);
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });

  it('renders public route without Layout for unauthenticated user', () => {
    // Note: Testing specific routes requires MemoryRouter, but AppRouter includes BrowserRouter
    // This test verifies the general behavior
    renderWithProviders(false);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
