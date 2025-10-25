export const BFF_AUTH_ENDPOINTS = {
  signup: '/auth/signup',
  verifyOtp: '/auth/verify-otp',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  profile: '/auth/profile',
  resendOtp: '/auth/resend-otp',
};

export const BFF_DASHBOARD_ENDPOINTS = {
  stats: '/dashboard/stats',
  activeUsers: '/dashboard/active-users',
  recentReports: '/dashboard/recent-reports',
  recentActivities: '/dashboard/recent-activities',
};

export const BFF_REPORTS_ENDPOINTS = {
  reports: '/reports',
  reportById: (id: string) => `/reports/${id}`,
  reportAction: (id: string) => `/reports/${id}/actions`,
  reportsStats: '/reports/stats/summary',
};

export const BFF_USERS_ENDPOINTS = {
  list: '/users',
  detail: (id: string) => `/users/${id}`,
  ban: (id: string) => `/users/${id}/ban`,
  unban: (id: string) => `/users/${id}/unban`,
  verify: (id: string) => `/users/${id}/verify`,
  unverify: (id: string) => `/users/${id}/unverify`,
  resetPassword: (id: string) => `/users/${id}/reset-password`,
};

export const BFF_POSTS_ENDPOINTS = {
  list: '/posts',
  detail: (id: string) => `/posts/${id}`,
  hide: (id: string) => `/posts/${id}/hide`,
  unhide: (id: string) => `/posts/${id}/unhide`,
  delete: (id: string) => `/posts/${id}/delete`,
};

export const BFF_COMMENTS_ENDPOINTS = {
  list: '/comments',
  detail: (id: string) => `/comments/${id}`,
  hide: (id: string) => `/comments/${id}/hide`,
  unhide: (id: string) => `/comments/${id}/unhide`,
  delete: (id: string) => `/comments/${id}/delete`,
};
