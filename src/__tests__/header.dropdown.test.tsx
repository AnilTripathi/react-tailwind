import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Header from '../layout/header';
import authReducer from '../store/authSlice';

// Mock the logo import
jest.mock('../assets/logo.png', () => 'logo.png');

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

const renderHeader = (isAuthenticated = false) => {
  const store = createTestStore(isAuthenticated);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </Provider>
  );
};

describe('Header Dropdown', () => {
  it('shows profile button when authenticated', () => {
    renderHeader(true);
    const profileButton = screen.getByRole('button', { name: /profile menu/i });
    expect(profileButton).toBeInTheDocument();
  });

  it('does not show profile button when not authenticated', () => {
    renderHeader(false);
    const profileButton = screen.queryByRole('button', { name: /profile menu/i });
    expect(profileButton).not.toBeInTheDocument();
  });

  it('toggles dropdown when profile button is clicked', () => {
    renderHeader(true);
    const profileButton = screen.getByRole('button', { name: /profile menu/i });
    
    // Initially closed
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    
    // Click to open
    fireEvent.click(profileButton);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    
    // Click to close
    fireEvent.click(profileButton);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens dropdown with Enter key', () => {
    renderHeader(true);
    const profileButton = screen.getByRole('button', { name: /profile menu/i });
    
    fireEvent.keyDown(profileButton, { key: 'Enter' });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('opens dropdown with Space key', () => {
    renderHeader(true);
    const profileButton = screen.getByRole('button', { name: /profile menu/i });
    
    fireEvent.keyDown(profileButton, { key: ' ' });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('closes dropdown with Escape key', async () => {
    renderHeader(true);
    const profileButton = screen.getByRole('button', { name: /profile menu/i });
    
    // Open dropdown
    fireEvent.click(profileButton);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    
    // Close with Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('shows logout menu item in dropdown', () => {
    renderHeader(true);
    const profileButton = screen.getByRole('button', { name: /profile menu/i });
    
    fireEvent.click(profileButton);
    const logoutItem = screen.getByRole('menuitem', { name: /logout/i });
    expect(logoutItem).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    renderHeader(true);
    const profileButton = screen.getByRole('button', { name: /profile menu/i });
    
    // Open dropdown
    fireEvent.click(profileButton);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    
    // Click outside
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });
});