import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/src/lib/client-api";
import { BFF_POSTS_ENDPOINTS } from "@/src/constants/client-endpoints";
import { ListPostsQuery, Post, PostListResponse } from "../types/posts";

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Posts", "Post"],
  endpoints: (builder) => ({
    listPosts: builder.query<PostListResponse, ListPostsQuery>({
      query: (params) => ({
        url: BFF_POSTS_ENDPOINTS.list,
        method: "GET",
        params,
      }),
      providesTags: ["Posts"],
    }),

    getPost: builder.query<Post, string>({
      query: (id) => ({ url: BFF_POSTS_ENDPOINTS.detail(id), method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Post", id }],
    }),

    updatePost: builder.mutation<
      Post,
      { id: string; content?: string; caption?: string }
    >({
      query: ({ id, ...body }) => ({
        url: BFF_POSTS_ENDPOINTS.update(id),
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Posts"],
    }),

    hidePost: builder.mutation<void, string>({
      query: (id) => ({ url: BFF_POSTS_ENDPOINTS.hide(id), method: "PATCH" }),
      invalidatesTags: ["Posts"],
    }),

    unhidePost: builder.mutation<void, string>({
      query: (id) => ({ url: BFF_POSTS_ENDPOINTS.unhide(id), method: "PATCH" }),
      invalidatesTags: ["Posts"],
    }),

    deletePost: builder.mutation<void, string>({
      query: (id) => ({ url: BFF_POSTS_ENDPOINTS.delete(id), method: "PATCH" }),
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const {
  useListPostsQuery,
  useGetPostQuery,
  useUpdatePostMutation,
  useHidePostMutation,
  useUnhidePostMutation,
  useDeletePostMutation,
} = postsApi;
