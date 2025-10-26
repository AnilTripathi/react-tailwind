import { configureStore } from '@reduxjs/toolkit';
import { appAPI } from '../services/api';
import { setupListeners } from '@reduxjs/toolkit/query';
import { myTodoSlice } from '@/services/mytodo';

export const store = configureStore({
  reducer: {
    [appAPI.reducerPath]: appAPI.reducer,
    'myTodos': myTodoSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(appAPI.middleware),
  devTools: process.env.NODE_ENV === 'development',
});
setupListeners(store.dispatch)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
