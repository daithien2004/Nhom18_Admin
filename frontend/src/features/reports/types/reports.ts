export type ReportType = 'user' | 'post' | 'comment';
export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';

export interface Report {
  id: string;
  reporter: {
    id: string;
    username: string;
    email: string;
  };
  reportedUser?: {
    id: string;
    username: string;
    email: string;
  };
  reportedPost?: {
    id: string;
    content: string;
  };
  reportedComment?: {
    id: string;
    content: string;
  };
  reportType: ReportType;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  adminNotes?: string;
  resolvedBy?: {
    id: string;
    username: string;
    email: string;
  };
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReportReason =
  | 'spam'
  | 'inappropriate_content'
  | 'harassment'
  | 'fake_information'
  | 'violence'
  | 'hate_speech'
  | 'other';

export interface ReportsQuery {
  page?: number;
  limit?: number;
  status?: ReportStatus;
  reportType?: ReportType;
  reason?: string;
  search?: string;
}

export interface ReportsResponse {
  reports: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ReportAction {
  action: 'dismiss' | 'hide_content' | 'ban_user' | 'warn_user';
  adminNotes?: string;
  reason?: string;
}

export interface ReportsStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  dismissedReports: number;
  reportsByType: Array<{
    id: string;
    count: number;
  }>;
  reportsByReason: Array<{
    id: string;
    count: number;
  }>;
}
