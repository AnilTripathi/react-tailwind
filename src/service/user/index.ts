/**
 * User service using RTK Query
 * Handles user-related API calls and data management
 */

import { appAPI } from '../api';
import { ENDPOINTS } from '../../constants/endpoints';
import type { User } from '../../types/user';

export const userApi = appAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => ENDPOINTS.USER.GET_ALL,
    }),
    getUserById: builder.query<User, number>({
      query: (id) => ENDPOINTS.USER.GET_BY_ID(id),
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery } = userApi;