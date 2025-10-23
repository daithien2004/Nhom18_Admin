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
  lastActivity: Date;
  postCount: number;
  commentCount: number;
  likeCount: number;
}
