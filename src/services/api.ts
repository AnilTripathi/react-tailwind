import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const appAPI = createApi({
  reducerPath: 'appAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/',
  }),
  endpoints: () => ({
  }),
});