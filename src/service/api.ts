/**
 * Root API configuration for RTK Query
 * Base setup for all API services with automatic token refresh on 401
 */

import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import { tokenRefreshed, logout } from '../store/authSlice';
import { tokenStorage } from '../utils/tokenStorage';
import { ENDPOINTS } from '../constants/endpoints';
import type { RefreshResponse } from '../types/auth';

let refreshPromise: Promise<RefreshResponse> | null = null;

const baseQuery = fetchBaseQuery({
  baseUrl: ENDPOINTS.BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!refreshPromise) {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        api.dispatch(logout());
        return result;
      }

      refreshPromise = (async () => {
        const refreshResult = await baseQuery(
          {
            url: ENDPOINTS.AUTH.REFRESH,
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions
        );
        
        refreshPromise = null;
        if (refreshResult.data) {
          return refreshResult.data as RefreshResponse;
        }
        
        api.dispatch(logout());
        tokenStorage.clear();
        throw new Error('Refresh failed');
      })();
    }

    try {
      const refreshData = await refreshPromise;
      api.dispatch(tokenRefreshed({ accessToken: refreshData.accessToken }));
      tokenStorage.setRefreshToken(refreshData.refreshToken);

      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } catch {
      // Refresh failed, user will be logged out
    }
  }

  return result;
};

export const appAPI = createApi({
  reducerPath: 'appAPI',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Auth'],
  endpoints: () => ({}),
});
