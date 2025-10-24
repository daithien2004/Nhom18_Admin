import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/src/lib/client-api";
import { BFF_USERS_ENDPOINTS } from "@/src/constants/client-endpoints";
import { User, UserListResponse } from "../types/users";

/**
 * API slice quản lý người dùng
 * Dùng axiosBaseQuery để gọi tới BFF (Next.js API routes)
 */
export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Users", "User"],

  endpoints: (builder) => ({
    // Lấy danh sách người dùng (có phân trang + tìm kiếm)
    listUsers: builder.query<
      UserListResponse,
      {
        current: number;
        pageSize: number;
        search?: string;
      }
    >({
      query: (params) => ({
        url: BFF_USERS_ENDPOINTS.list,
        method: "GET",
        params,
      }),
      providesTags: ["Users"],
    }),

    // Lấy chi tiết người dùng
    getUser: builder.query<User, string>({
      query: (id) => ({
        url: BFF_USERS_ENDPOINTS.detail(id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // Khóa người dùng
    banUser: builder.mutation<void, string>({
      query: (id) => ({
        url: BFF_USERS_ENDPOINTS.ban(id),
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),

    // Mở khóa người dùng
    unbanUser: builder.mutation<void, string>({
      query: (id) => ({
        url: BFF_USERS_ENDPOINTS.unban(id),
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),

    // Xác thực người dùng (verify)
    verifyUser: builder.mutation<void, string>({
      query: (id) => ({
        url: BFF_USERS_ENDPOINTS.verify(id),
        method: "PATCH",
      }),
      invalidatesTags: ["Users", "User"],
    }),

    // Bỏ xác thực người dùng (unverify)
    unverifyUser: builder.mutation<void, string>({
      query: (id) => ({
        url: BFF_USERS_ENDPOINTS.unverify(id),
        method: "PATCH",
      }),
      invalidatesTags: ["Users", "User"],
    }),

    // Đặt lại mật khẩu người dùng
    resetPassword: builder.mutation<void, { id: string; newPassword: string }>({
      query: ({ id, newPassword }) => ({
        url: BFF_USERS_ENDPOINTS.resetPassword(id),
        method: "POST",
        body: { newPassword },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

// Export hooks tự động sinh ra bởi RTK Query
export const {
  useListUsersQuery,
  useGetUserQuery,
  useBanUserMutation,
  useUnbanUserMutation,
  useVerifyUserMutation,
  useUnverifyUserMutation,
  useResetPasswordMutation,
} = usersApi;
