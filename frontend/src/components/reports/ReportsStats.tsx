'use client';

import {
  REPORT_REASON_MAP,
  REPORT_TYPE_MAP,
} from '@/src/features/reports/constants/constants';
import {
  ReportReason,
  ReportsStats as ReportsStatsType,
  ReportType,
} from '@/src/features/reports/types/reports';

interface ReportsStatsProps {
  stats?: ReportsStatsType | null;
  loading?: boolean;
}

export default function ReportsStats({
  stats,
  loading = false,
}: ReportsStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const getReasonText = (reason: ReportReason | string) => {
    return REPORT_REASON_MAP[reason as ReportReason] || reason;
  };

  const getTypeText = (type: ReportType | string): string => {
    return REPORT_TYPE_MAP[type as ReportType] || type;
  };

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng báo cáo</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalReports}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pendingReports}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã xử lý</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.resolvedReports}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <span className="text-2xl">❌</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã bỏ qua</p>
              <p className="text-2xl font-bold text-gray-600">
                {stats.dismissedReports}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports by Type */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Báo cáo theo loại
          </h3>
          <div className="space-y-3">
            {stats.reportsByType.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {getTypeText(item.id)}
                </span>
                <span className="text-sm text-gray-600">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reports by Reason */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Báo cáo theo lý do
          </h3>
          <div className="space-y-3">
            {stats.reportsByReason.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {getReasonText(item.id)}
                </span>
                <span className="text-sm text-gray-600">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
