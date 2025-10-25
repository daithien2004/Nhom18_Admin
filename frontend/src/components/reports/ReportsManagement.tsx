'use client';

import { useState, useEffect } from 'react';
import ReportsList from './ReportsList';
import ReportsFilters from './ReportsFilters';
import ReportsStats from './ReportsStats';
import ReportDetailModal from './ReportDetailModal';
import { Report, ReportsQuery } from '@/src/features/reports/types/reports';
import {
  useGetReportsQuery,
  useHandleReportActionMutation,
  useGetReportsStatsQuery,
} from '@/src/features/reports/api/reportsApi';

export default function ReportsManagement() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<ReportsQuery>({
    page: 1,
    limit: 10,
    status: undefined,
    reportType: undefined,
    reason: '',
    search: '',
  });

  // API hooks
  const {
    data: reportsData,
    isLoading: reportsLoading,
    error: reportsError,
    refetch: refetchReports,
  } = useGetReportsQuery(filters);

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useGetReportsStatsQuery();

  const [handleReportAction, { isLoading: actionLoading }] =
    useHandleReportActionMutation();

  const handleFilterChange = (newFilters: Partial<ReportsQuery>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handleReportActionSubmit = async (
    reportId: string,
    action: string,
    notes?: string
  ) => {
    try {
      await handleReportAction({
        id: reportId,
        action: { action: action as any, adminNotes: notes },
      }).unwrap();

      // Reload reports after action
      await refetchReports();
      setIsModalOpen(false);
      setSelectedReport(null);
    } catch (error) {
      console.error('Error handling report action:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <ReportsStats stats={statsData} loading={statsLoading} />

      {/* Filters */}
      <ReportsFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Reports List */}
      <ReportsList
        reports={reportsData?.reports || []}
        loading={reportsLoading}
        pagination={
          reportsData?.pagination || { page: 1, limit: 10, total: 0, pages: 0 }
        }
        onReportClick={handleReportClick}
        onPageChange={handlePageChange}
      />

      {/* Report Detail Modal */}
      {isModalOpen && selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onAction={handleReportActionSubmit}
        />
      )}
    </div>
  );
}
