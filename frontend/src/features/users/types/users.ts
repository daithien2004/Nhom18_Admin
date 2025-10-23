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

export interface ListUsersQuery {
  current?: number;
  pageSize?: number;
  search?: string;
}

export interface ResetPasswordRequest {
  id: string;
  newPassword: string;
}
