'use client';

import { useState } from 'react';
import {
  Report,
  ReportReason,
  ReportStatus,
  ReportType,
} from '@/src/features/reports/types/reports';
import {
  REPORT_REASON_MAP,
  REPORT_STATUS_MAP,
  REPORT_TYPE_MAP,
} from '@/src/features/reports/constants/constants';

interface ReportDetailModalProps {
  report: Report;
  isOpen: boolean;
  onClose: () => void;
  onAction: (reportId: string, action: string, notes?: string) => void;
}

export default function ReportDetailModal({
  report,
  isOpen,
  onClose,
  onAction,
}: ReportDetailModalProps) {
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const getReasonText = (reason: ReportReason | string) => {
    return REPORT_REASON_MAP[reason as ReportReason] || reason;
  };

  const getTypeText = (type: ReportType | string): string => {
    return REPORT_TYPE_MAP[type as ReportType] || type;
  };

  const getStatusText = (status: ReportStatus | string) => {
    return REPORT_STATUS_MAP[status as ReportStatus] || status;
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) return;

    setIsSubmitting(true);
    try {
      await onAction(report.id, selectedAction, adminNotes);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedAction('');
    setAdminNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Chi tiết báo cáo
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Details */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Thông tin báo cáo
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">ID:</span>
                    <span className="text-gray-900">{report.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Loại:</span>
                    <span className="text-gray-900">
                      {getTypeText(report.reportType)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Lý do:</span>
                    <span className="text-gray-900">
                      {getReasonText(report.reason)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      Trạng thái:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {getStatusText(report.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      Thời gian tạo:
                    </span>
                    <span className="text-gray-900">
                      {new Date(report.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reporter Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Người báo cáo
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Tên:</span>
                    <span className="text-gray-900">
                      {report.reporter.username}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="text-gray-900">
                      {report.reporter.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reported Content */}
              {(report.reportedUser ||
                report.reportedPost ||
                report.reportedComment) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Nội dung bị báo cáo
                  </h3>
                  {report.reportedUser && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">
                          Người dùng:
                        </span>
                        <span className="text-gray-900">
                          {report.reportedUser.username}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">
                          Email:
                        </span>
                        <span className="text-gray-900">
                          {report.reportedUser.email}
                        </span>
                      </div>
                    </div>
                  )}
                  {report.reportedPost && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">
                          Bài viết ID:
                        </span>
                        <span className="text-gray-900">
                          {report.reportedPost.id}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Nội dung:
                        </span>
                        <p className="text-gray-900 mt-1 p-2 bg-white rounded border">
                          {report.reportedPost.content}
                        </p>
                      </div>
                    </div>
                  )}
                  {report.reportedComment && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">
                          Bình luận ID:
                        </span>
                        <span className="text-gray-900">
                          {report.reportedComment.id}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Nội dung:
                        </span>
                        <p className="text-gray-900 mt-1 p-2 bg-white rounded border">
                          {report.reportedComment.content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              {report.description && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Mô tả chi tiết
                  </h3>
                  <p className="text-gray-900">{report.description}</p>
                </div>
              )}

              {/* Admin Notes */}
              {report.adminNotes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Ghi chú admin
                  </h3>
                  <p className="text-gray-900">{report.adminNotes}</p>
                </div>
              )}
            </div>

            {/* Action Panel */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Thực hiện hành động
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn hành động
                    </label>
                    <select
                      value={selectedAction}
                      onChange={(e) => setSelectedAction(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">-- Chọn hành động --</option>
                      <option value="dismiss">Bỏ qua báo cáo</option>
                      {report.reportedPost && (
                        <option value="hide_content">Ẩn bài viết</option>
                      )}
                      {report.reportedComment && (
                        <option value="hide_content">Ẩn bình luận</option>
                      )}
                      {report.reportedUser && (
                        <>
                          <option value="warn_user">Cảnh báo người dùng</option>
                          <option value="ban_user">Khóa tài khoản</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú admin
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Nhập ghi chú về hành động này..."
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={!selectedAction || isSubmitting}
                      className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? 'Đang xử lý...' : 'Thực hiện'}
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>

              {/* Action History */}
              {report.resolvedBy && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Lịch sử xử lý
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        Xử lý bởi:
                      </span>
                      <span className="text-gray-900">
                        {report.resolvedBy.username}
                      </span>
                    </div>
                    {report.resolvedAt && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">
                          Thời gian:
                        </span>
                        <span className="text-gray-900">
                          {new Date(report.resolvedAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
