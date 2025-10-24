import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/slice/authSlice";
import dashboardReducer from "../features/dashboard/slice/dashboardSlice";
import { authApi } from "../features/auth/api/authApi";
import { dashboardApi } from "../features/dashboard/api/dashboardApi";
import { usersApi } from "../features/users/api/usersApi";
import { postsApi } from "../features/posts";

export const store = configureStore({
  reducer: {
    auth: authReducer, // State: state.auth
    dashboard: dashboardReducer, // State: state.dashboard
    [authApi.reducerPath]: authApi.reducer, // State: state.authApi
    [dashboardApi.reducerPath]: dashboardApi.reducer, // State: state.dashboardApi
    [usersApi.reducerPath]: usersApi.reducer, // State: state.usersApi
    [postsApi.reducerPath]: postsApi.reducer, // State: state.postsApi
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      dashboardApi.middleware,
      usersApi.middleware,
      postsApi.middleware
    ), // Thêm middleware của RTK Query
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
