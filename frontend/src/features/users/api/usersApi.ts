import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/src/lib/client-api";
import { BFF_USERS_ENDPOINTS } from "@/src/constants/client-endpoints";
import { User, UserListResponse } from "../types/users";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Users", "User"],
  endpoints: (builder) => ({
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
        params, // ✅ Truyền params trực tiếp
      }),
      providesTags: ["Users"],
    }),

    getUser: builder.query<User, string>({
      query: (id) => ({
        url: BFF_USERS_ENDPOINTS.detail(id), // ✅ Wrap trong object
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    banUser: builder.mutation<void, string>({
      query: (id) => ({
        url: BFF_USERS_ENDPOINTS.ban(id),
        method: "POST",
        body: { action: "ban" },
      }),
      invalidatesTags: ["Users"],
    }),

    unbanUser: builder.mutation<void, string>({
      query: (id) => ({
        url: BFF_USERS_ENDPOINTS.unban(id),
        method: "POST",
        body: { action: "unban" },
      }),
      invalidatesTags: ["Users"],
    }),

    verifyUser: builder.mutation<void, string>({
      query: (id) => ({
        url: BFF_USERS_ENDPOINTS.verify(id),
        method: "POST",
        body: { action: "verify" },
      }),
      invalidatesTags: ["Users", "User"],
    }),

    unverifyUser: builder.mutation<void, string>({
      query: (id) => ({
        url: BFF_USERS_ENDPOINTS.unverify(id),
        method: "POST",
        body: { action: "unverify" },
      }),
      invalidatesTags: ["Users", "User"],
    }),

    resetPassword: builder.mutation<void, { id: string; newPassword: string }>({
      query: ({ id, newPassword }) => ({
        url: BFF_USERS_ENDPOINTS.resetPassword(id),
        method: "POST",
        body: { action: "resetPassword", newPassword },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useListUsersQuery,
  useGetUserQuery,
  useBanUserMutation,
  useUnbanUserMutation,
  useVerifyUserMutation,
  useUnverifyUserMutation,
  useResetPasswordMutation,
} = usersApi;
