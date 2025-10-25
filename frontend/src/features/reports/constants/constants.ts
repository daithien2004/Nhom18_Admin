import { ReportReason, ReportStatus, ReportType } from '../types/reports';

export const REPORT_REASON_MAP: Record<ReportReason, string> = {
  spam: 'Spam',
  inappropriate_content: 'Nội dung không phù hợp',
  harassment: 'Quấy rối',
  fake_information: 'Thông tin giả',
  violence: 'Bạo lực',
  hate_speech: 'Ngôn từ thù địch',
  other: 'Khác',
};

export const REPORT_TYPE_MAP: Record<ReportType, string> = {
  user: 'Người dùng',
  post: 'Bài viết',
  comment: 'Bình luận',
};

export const REPORT_STATUS_MAP: Record<ReportStatus, string> = {
  pending: 'Chờ xử lý',
  reviewing: 'Đang xem xét',
  resolved: 'Đã xử lý',
  dismissed: 'Đã bỏ qua',
};
