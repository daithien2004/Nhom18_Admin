import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/src/lib/client-api';
import { BFF_DASHBOARD_ENDPOINTS } from '@/src/constants/client-endpoints';
import {
  DashboardStats,
  UserActivity,
  Report,
  Activity,
  DashboardStatsRequest,
  ActiveUsersRequest,
  RecentReportsRequest,
  RecentActivitiesRequest,
} from '../types/dashboard';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'DashboardStats',
    'ActiveUsers',
    'RecentReports',
    'RecentActivities',
  ],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, DashboardStatsRequest>({
      query: (params) => ({
        url: BFF_DASHBOARD_ENDPOINTS.stats,
        method: 'GET',
        params,
      }),
      providesTags: ['DashboardStats'],
    }),

    getActiveUsers: builder.query<UserActivity[], ActiveUsersRequest>({
      query: (params) => ({
        url: BFF_DASHBOARD_ENDPOINTS.activeUsers,
        method: 'GET',
        params,
      }),
      providesTags: ['ActiveUsers'],
    }),

    getRecentReports: builder.query<Report[], RecentReportsRequest>({
      query: (params) => ({
        url: BFF_DASHBOARD_ENDPOINTS.recentReports,
        method: 'GET',
        params,
      }),
      providesTags: ['RecentReports'],
    }),

    getRecentActivities: builder.query<Activity[], RecentActivitiesRequest>({
      query: (params) => ({
        url: BFF_DASHBOARD_ENDPOINTS.recentActivities,
        method: 'GET',
        params,
      }),
      providesTags: ['RecentActivities'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetActiveUsersQuery,
  useGetRecentReportsQuery,
  useGetRecentActivitiesQuery,
} = dashboardApi;
