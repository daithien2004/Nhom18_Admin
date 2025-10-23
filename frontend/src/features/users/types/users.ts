// Interface cho user item
export interface UserListItem {
  id?: string; // Có thể không có tuỳ backend
  _id?: string;
  username: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  isBanned: boolean;
  createdAt?: string;
}

// Interface cho dữ liệu phân trang
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    current: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// Interface cho param query khi lấy danh sách user
export interface ListUsersQuery {
  current?: number;
  pageSize?: number;
  search?: string;
}

// Interface cho mutation reset password
export interface ResetPasswordRequest {
  id: string;
  newPassword: string;
}

// Response reset password
export interface ResetPasswordResponse {
  id: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  bio?: string;
  isVerified: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  items: User[];
  pagination: {
    current: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
