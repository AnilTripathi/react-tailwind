import {appAPI} from '../api';
import type { User } from '@/types/user';

export const userAPI = appAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => 'users',
    }),
  }),
});

export const { useGetUsersQuery } = userAPI;