'use client';

import {
  REPORT_REASON_MAP,
  REPORT_STATUS_MAP,
  REPORT_TYPE_MAP,
} from '@/src/features/reports/constants/constants';
import {
  Report,
  ReportReason,
  ReportStatus,
  ReportType,
} from '@/src/features/reports/types/reports';

interface ReportsListProps {
  reports: Report[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  onReportClick: (report: Report) => void;
  onPageChange: (page: number) => void;
}

export default function ReportsList({
  reports,
  loading,
  pagination,
  onReportClick,
  onPageChange,
}: ReportsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ReportStatus | string) => {
    return REPORT_STATUS_MAP[status as ReportStatus] || status;
  };

  const getReasonText = (reason: ReportReason | string) => {
    return REPORT_REASON_MAP[reason as ReportReason] || reason;
  };

  const getTypeText = (type: ReportType | string): string => {
    return REPORT_TYPE_MAP[type as ReportType] || type;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Danh sách báo cáo
        </h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Danh sách báo cáo
        </h3>
        <span className="text-sm text-gray-600">
          {pagination.total} báo cáo
        </span>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <p className="text-gray-600">Không có báo cáo nào</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                onClick={() => onReportClick(report)}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {report.reporter.username}
                    </span>
                    <span className="text-sm text-gray-500">báo cáo</span>
                    {report.reportedUser && (
                      <span className="text-sm font-medium text-gray-900">
                        {report.reportedUser.username}
                      </span>
                    )}
                    {report.reportedPost && (
                      <span className="text-sm text-gray-500">bài viết</span>
                    )}
                    {report.reportedComment && (
                      <span className="text-sm text-gray-500">bình luận</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {getStatusText(report.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Loại:</span>{' '}
                    {getTypeText(report.reportType)}
                  </div>
                  <div>
                    <span className="font-medium">Lý do:</span>{' '}
                    {getReasonText(report.reason)}
                  </div>
                  <div>
                    <span className="font-medium">Thời gian:</span>{' '}
                    {new Date(report.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>

                {report.description && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Mô tả:</span>{' '}
                    {report.description}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Hiển thị {(pagination.page - 1) * pagination.limit + 1} -{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{' '}
                của {pagination.total} báo cáo
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                {[...Array(pagination.pages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === pagination.pages ||
                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-2 text-sm border rounded-lg ${
                          page === pagination.page
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === pagination.page - 2 ||
                    page === pagination.page + 2
                  ) {
                    return (
                      <span key={page} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
