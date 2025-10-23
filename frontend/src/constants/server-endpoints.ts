export const NESTJS_AUTH_ENDPOINTS = {
  signup: "/auth/signup",
  verifyOtp: "/auth/verify-otp",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  profile: "/auth/profile",
  resendOtp: "/auth/resend-otp",
};

export const NESTJS_DASHBOARD_ENDPOINTS = {
  stats: "/dashboard/stats",
  activeUsers: "/dashboard/active-users",
  recentReports: "/dashboard/recent-reports",
  recentActivities: "/dashboard/recent-activities",
};

export const NESTJS_USERS_ENDPOINTS = {
  list: "/users",
  detail: (id: string) => `/users/${id}`,
  ban: (id: string) => `/users/${id}/ban`,
  unban: (id: string) => `/users/${id}/unban`,
  verify: (id: string) => `/users/${id}/verify`,
  unverify: (id: string) => `/users/${id}/unverify`,
  resetPassword: (id: string) => `/users/${id}/reset-password`,
};
