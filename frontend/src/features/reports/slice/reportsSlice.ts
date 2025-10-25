import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Report, ReportsQuery } from '../types/reports';

interface ReportsState {
  reports: Report[];
  selectedReport: Report | null;
  filters: ReportsQuery;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  reports: [],
  selectedReport: null,
  filters: {
    page: 1,
    limit: 10,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setReports: (state, action: PayloadAction<Report[]>) => {
      state.reports = action.payload;
    },
    setSelectedReport: (state, action: PayloadAction<Report | null>) => {
      state.selectedReport = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ReportsQuery>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action: PayloadAction<typeof state.pagination>) => {
      state.pagination = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateReport: (state, action: PayloadAction<Report>) => {
      const index = state.reports.findIndex(
        (report) => report.id === action.payload.id
      );
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
      if (state.selectedReport?.id === action.payload.id) {
        state.selectedReport = action.payload;
      }
    },
    removeReport: (state, action: PayloadAction<string>) => {
      state.reports = state.reports.filter(
        (report) => report.id !== action.payload
      );
      if (state.selectedReport?.id === action.payload) {
        state.selectedReport = null;
      }
    },
  },
});

export const {
  setReports,
  setSelectedReport,
  setFilters,
  setPagination,
  setLoading,
  setError,
  clearError,
  updateReport,
  removeReport,
} = reportsSlice.actions;

export default reportsSlice.reducer;
