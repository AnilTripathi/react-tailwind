/**
 * Centralized API endpoint definitions
 *
 * Endpoints are grouped by feature for better organization:
 * - USER: User management related endpoints
 * - AUTH: Authentication related endpoints
 *
 * Naming convention: FEATURE_ACTION (e.g., USER_GET_ALL, AUTH_LOGIN)
 */

// User-related endpoints
export const USER_ENDPOINTS = {
  GET_ALL: 'users',
  GET_BY_ID: (id: number) => `users/${id}`,
} as const;

// Authentication-related endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: 'auth/login',
  LOGOUT: 'auth/logout',
  REFRESH: 'auth/refresh',
} as const;

// Export all endpoints for easy access
export const ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8089/api',
  USER: USER_ENDPOINTS,
  AUTH: AUTH_ENDPOINTS,
} as const;
