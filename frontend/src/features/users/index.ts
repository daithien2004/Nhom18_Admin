// src/features/users/index.ts
export { usersApi } from "./api/usersApi";
export {
  useListUsersQuery,
  useGetUserQuery,
  useBanUserMutation,
  useUnbanUserMutation,
  useVerifyUserMutation,
  useUnverifyUserMutation,
  useResetPasswordMutation,
} from "./api/usersApi";

// Types
export type {
  User,
  UserListResponse,
  ListUsersQuery,
  ResetPasswordRequest,
} from "./types/users";
