/**
 * Token storage utilities
 * Handles secure storage of refresh tokens and access token management
 */

const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenStorage = {
  setRefreshToken: (token: string) => {
    // Store in localStorage as fallback (HttpOnly cookie preferred in production)
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  removeRefreshToken: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  clear: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};