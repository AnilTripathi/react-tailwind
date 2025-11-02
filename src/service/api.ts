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
import { ENDPOINTS } from '../constants/endpoints';
import type { RefreshRequest, RefreshResponse } from '../types/auth';

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
      const authState = (api.getState() as RootState).auth;
      const { accessToken, refreshToken } = authState;
      
      if (!refreshToken || !accessToken) {
        api.dispatch(logout());
        return result;
      }

      refreshPromise = (async () => {
        const refreshRequestBody: RefreshRequest = {
          accessToken,
          refreshToken,
        };
        
        const refreshResult = await baseQuery(
          {
            url: ENDPOINTS.AUTH.REFRESH,
            method: 'POST',
            body: refreshRequestBody,
          },
          api,
          extraOptions
        );
        
        refreshPromise = null;
        if (refreshResult.data) {
          return refreshResult.data as RefreshResponse;
        }
        
        api.dispatch(logout());
        throw new Error('Refresh failed');
      })();
    }

    try {
      const refreshData = await refreshPromise;
      api.dispatch(tokenRefreshed({ 
        accessToken: refreshData.accessToken,
        refreshToken: refreshData.refreshToken 
      }));

      // Retry original request once
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
  tagTypes: ['User', 'Auth', 'UserTask'],
  endpoints: () => ({}),
});
