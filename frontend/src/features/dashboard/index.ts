// API
export { dashboardApi } from './api/dashboardApi';
export {
  useGetDashboardStatsQuery,
  useGetActiveUsersQuery,
  useGetRecentReportsQuery,
  useGetRecentActivitiesQuery,
} from './api/dashboardApi';

// Slice
export { default as dashboardReducer } from './slice/dashboardSlice';
export {
  setSelectedPeriod,
  setStats,
  setActiveUsers,
  setRecentReports,
  setRecentActivities,
  setLoading,
  setError,
  clearDashboard,
} from './slice/dashboardSlice';

// Types
export type {
  DashboardStats,
  UserActivity,
  Report,
  Activity,
  DashboardStatsRequest,
  ActiveUsersRequest,
  RecentReportsRequest,
  RecentActivitiesRequest,
} from './types/dashboard';
