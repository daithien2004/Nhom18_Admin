import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashboardStats, UserActivity, Report, Activity } from '../types/dashboard';

interface DashboardState {
  stats: DashboardStats | null;
  activeUsers: UserActivity[];
  recentReports: Report[];
  recentActivities: Activity[];
  selectedPeriod: '24h' | '7d' | '30d';
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  activeUsers: [],
  recentReports: [],
  recentActivities: [],
  selectedPeriod: '24h',
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSelectedPeriod: (state, action: PayloadAction<'24h' | '7d' | '30d'>) => {
      state.selectedPeriod = action.payload;
    },
    setStats: (state, action: PayloadAction<DashboardStats>) => {
      state.stats = action.payload;
    },
    setActiveUsers: (state, action: PayloadAction<UserActivity[]>) => {
      state.activeUsers = action.payload;
    },
    setRecentReports: (state, action: PayloadAction<Report[]>) => {
      state.recentReports = action.payload;
    },
    setRecentActivities: (state, action: PayloadAction<Activity[]>) => {
      state.recentActivities = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearDashboard: (state) => {
      state.stats = null;
      state.activeUsers = [];
      state.recentReports = [];
      state.recentActivities = [];
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setSelectedPeriod,
  setStats,
  setActiveUsers,
  setRecentReports,
  setRecentActivities,
  setLoading,
  setError,
  clearDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
