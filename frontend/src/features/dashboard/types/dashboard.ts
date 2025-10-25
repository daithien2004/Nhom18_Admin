export interface DashboardStats {
  totalUsers: number;
  newUsers: number;
  totalPosts: number;
  newPosts: number;
  totalComments: number;
  newComments: number;
  totalReports: number;
  newReports: number;
  activeUsers24h: number;
  pendingReports: number;
  resolvedReports: number;
  dismissedReports: number;
}

export interface UserActivity {
  userId: string;
  username: string;
  email: string;
  lastActivity: string;
  postCount: number;
  commentCount: number;
  likeCount: number;
}

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
  reportType: 'user' | 'post' | 'comment';
  reason: string;
  description?: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  adminNotes?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  actor: {
    id: string;
    username: string;
    email: string;
  };
  post: {
    id: string;
    content?: string;
  };
  postOwner: {
    id: string;
    username: string;
    email: string;
  };
  type: 'like' | 'comment';
  comment?: {
    id: string;
    content: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStatsRequest {
  period?: '24h' | '7d' | '30d';
}

export interface ActiveUsersRequest {
  limit?: number;
}

export interface RecentReportsRequest {
  limit?: number;
}

export interface RecentActivitiesRequest {
  limit?: number;
}
