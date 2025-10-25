import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/src/lib/client-api';
import { BFF_REPORTS_ENDPOINTS } from '@/src/constants/client-endpoints';
import {
  Report,
  ReportsQuery,
  ReportsResponse,
  ReportAction,
  ReportsStats,
} from '../types/reports';

export const reportsApi = createApi({
  reducerPath: 'reportsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Reports', 'ReportsStats'],
  endpoints: (builder) => ({
    getReports: builder.query<ReportsResponse, ReportsQuery>({
      query: (params) => ({
        url: BFF_REPORTS_ENDPOINTS.reports,
        method: 'GET',
        params,
      }),
      providesTags: ['Reports'],
    }),

    getReportById: builder.query<Report, string>({
      query: (id) => ({
        url: BFF_REPORTS_ENDPOINTS.reportById(id),
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Reports', id }],
    }), // Đã sửa: data -> body

    createReport: builder.mutation<Report, Partial<Report>>({
      query: (report) => ({
        url: BFF_REPORTS_ENDPOINTS.reports,
        method: 'POST',
        body: report, // <-- Sửa
      }),
      invalidatesTags: ['Reports', 'ReportsStats'],
    }), // Đã sửa: data -> body

    updateReport: builder.mutation<
      Report,
      { id: string; data: Partial<Report> }
    >({
      query: ({ id, data }) => ({
        url: BFF_REPORTS_ENDPOINTS.reportById(id),
        method: 'PUT',
        body: data, // <-- Sửa
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Reports', id },
        'Reports',
      ],
    }), // Đã sửa: data -> body

    handleReportAction: builder.mutation<
      { message: string; report: Report },
      { id: string; action: ReportAction }
    >({
      query: ({ id, action }) => ({
        url: BFF_REPORTS_ENDPOINTS.reportAction(id),
        method: 'POST',
        body: action, // <-- Sửa
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Reports', id },
        'Reports',
        'ReportsStats',
      ],
    }),

    deleteReport: builder.mutation<void, string>({
      query: (id) => ({
        url: BFF_REPORTS_ENDPOINTS.reportById(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Reports', 'ReportsStats'],
    }),

    getReportsStats: builder.query<ReportsStats, void>({
      query: () => ({
        url: BFF_REPORTS_ENDPOINTS.reportsStats,
        method: 'GET',
      }),
      providesTags: ['ReportsStats'],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  useHandleReportActionMutation,
  useDeleteReportMutation,
  useGetReportsStatsQuery,
} = reportsApi;
