import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/src/lib/client-api";
import { BFF_CONTENT_MODERATION_ENDPOINTS } from "@/src/constants/client-endpoints";
import {
  SearchInappropriatePostsQuery,
  Post,
  PostListResponse,
  ModerationStats,
} from "../types/content-moderation";

// Toan: API for content moderation functionality
export const contentModerationApi = createApi({
  reducerPath: "contentModerationApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["ContentModeration", "InappropriatePosts"],
  endpoints: (builder) => ({
    // Toan: Search for inappropriate posts
    searchInappropriatePosts: builder.query<
      PostListResponse,
      SearchInappropriatePostsQuery
    >({
      query: (params) => ({
        url: BFF_CONTENT_MODERATION_ENDPOINTS.search,
        method: "GET",
        params,
      }),
      providesTags: ["InappropriatePosts"],
    }),

    // Toan: Get flagged posts
    getFlaggedPosts: builder.query<Post[], void>({
      query: () => ({
        url: BFF_CONTENT_MODERATION_ENDPOINTS.flagged,
        method: "GET",
      }),
      providesTags: ["InappropriatePosts"],
    }),

    // Toan: Get post details for moderation
    getPostForModeration: builder.query<Post, string>({
      query: (id) => ({
        url: BFF_CONTENT_MODERATION_ENDPOINTS.post(id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ContentModeration", id }],
    }),

    // Toan: Delete inappropriate post permanently
    deleteInappropriatePost: builder.mutation<void, string>({
      query: (id) => ({
        url: BFF_CONTENT_MODERATION_ENDPOINTS.delete(id),
        method: "PATCH",
      }),
      invalidatesTags: ["InappropriatePosts"],
    }),

    // Toan: Hide inappropriate post
    hideInappropriatePost: builder.mutation<void, string>({
      query: (id) => ({
        url: BFF_CONTENT_MODERATION_ENDPOINTS.hide(id),
        method: "PATCH",
      }),
      invalidatesTags: ["InappropriatePosts"],
    }),

    // Toan: Unhide post if content is appropriate
    unhidePost: builder.mutation<void, string>({
      query: (id) => ({
        url: BFF_CONTENT_MODERATION_ENDPOINTS.unhide(id),
        method: "PATCH",
      }),
      invalidatesTags: ["InappropriatePosts"],
    }),

    // Toan: Get moderation statistics
    getModerationStats: builder.query<ModerationStats, void>({
      query: () => ({
        url: BFF_CONTENT_MODERATION_ENDPOINTS.stats,
        method: "GET",
      }),
      providesTags: ["ContentModeration"],
    }),
  }),
});

export const {
  useSearchInappropriatePostsQuery,
  useGetFlaggedPostsQuery,
  useGetPostForModerationQuery,
  useDeleteInappropriatePostMutation,
  useHideInappropriatePostMutation,
  useUnhidePostMutation,
  useGetModerationStatsQuery,
} = contentModerationApi;
