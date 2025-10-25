import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slice/authSlice';
import dashboardReducer from '../features/dashboard/slice/dashboardSlice';
import reportsReducer from '../features/reports/slice/reportsSlice';
import { authApi } from '../features/auth/api/authApi';
import { dashboardApi } from '../features/dashboard/api/dashboardApi';
import { reportsApi } from '../features/reports/api/reportsApi';
import { usersApi } from '../features/users/api/usersApi';
import { postsApi } from '../features/posts/api/postsApi';
import { commentsApi } from '../features/comments/api/commentsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer, // State: state.auth
    dashboard: dashboardReducer, // State: state.dashboard
    reports: reportsReducer, // State: state.reports
    [authApi.reducerPath]: authApi.reducer, // State: state.authApi
    [dashboardApi.reducerPath]: dashboardApi.reducer, // State: state.dashboardApi
    [reportsApi.reducerPath]: reportsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      dashboardApi.middleware,
      reportsApi.middleware,
      usersApi.middleware,
      postsApi.middleware,
      commentsApi.middleware
    ), // Thêm middleware của RTK Query
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
