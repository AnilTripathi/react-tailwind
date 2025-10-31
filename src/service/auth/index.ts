/**
 * Authentication service using RTK Query
 * Handles login, logout, and authentication-related API calls
 */

import { appAPI } from '../api';
import { ENDPOINTS } from '../../constants/endpoints';
import type { LoginRequest, LoginResponse, RefreshResponse } from '../../types/auth';

export const authApi = appAPI.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        body: credentials,
      }),
    }),
    refresh: builder.mutation<RefreshResponse, { refreshToken: string }>({
      query: ({ refreshToken }) => ({
        url: ENDPOINTS.AUTH.REFRESH,
        method: 'POST',
        body: { refreshToken },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: ENDPOINTS.AUTH.LOGOUT,
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation, useLogoutMutation } = authApi;