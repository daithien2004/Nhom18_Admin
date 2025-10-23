"use client";

import { Report } from "@/src/features/dashboard/types/dashboard";

interface RecentReportsListProps {
  reports: Report[];
  loading?: boolean;
}

export default function RecentReportsList({
  reports,
  loading = false,
}: RecentReportsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewing":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "dismissed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getReasonText = (reason: string) => {
    const reasonMap: Record<string, string> = {
      spam: "Spam",
      inappropriate_content: "Nội dung không phù hợp",
      harassment: "Quấy rối",
      fake_information: "Thông tin giả",
      violence: "Bạo lực",
      hate_speech: "Ngôn từ thù địch",
      other: "Khác",
    };
    return reasonMap[reason] || reason;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Báo cáo gần đây
        </h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Báo cáo gần đây
      </h3>
      <div className="space-y-3">
        {reports.map((report) => (
          <div key={report.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  {/* {report.reporter.username} */}
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
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  report.status
                )}`}
              >
                {report.status}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <p>
                <strong>Lý do:</strong> {getReasonText(report.reason)}
              </p>
              {report.description && (
                <p className="mt-1">
                  <strong>Mô tả:</strong> {report.description}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {new Date(report.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
