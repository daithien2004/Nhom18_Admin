import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/src/lib/client-api";
import { BFF_COMMENTS_ENDPOINTS } from "@/src/constants/client-endpoints";
import {
  ListCommentsQuery,
  Comment,
  CommentListResponse,
} from "../types/comments";

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Comments", "Comment"],
  endpoints: (builder) => ({
    listComments: builder.query<CommentListResponse, ListCommentsQuery>({
      query: (params) => ({
        url: BFF_COMMENTS_ENDPOINTS.list,
        method: "GET",
        params,
      }),
      providesTags: ["Comments"],
    }),

    getComment: builder.query<Comment, string>({
      query: (id) => ({
        url: BFF_COMMENTS_ENDPOINTS.detail(id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Comment", id }],
    }),

    hideComment: builder.mutation<void, string>({
      query: (id) => ({
        url: BFF_COMMENTS_ENDPOINTS.hide(id),
        method: "PATCH",
      }),
      invalidatesTags: ["Comments"],
    }),

    unhideComment: builder.mutation<void, string>({
      query: (id) => ({
        url: BFF_COMMENTS_ENDPOINTS.unhide(id),
        method: "PATCH",
      }),
      invalidatesTags: ["Comments"],
    }),

    deleteComment: builder.mutation<void, string>({
      query: (id) => ({
        url: BFF_COMMENTS_ENDPOINTS.delete(id),
        method: "PATCH",
      }),
      invalidatesTags: ["Comments"],
    }),
  }),
});

export const {
  useListCommentsQuery,
  useGetCommentQuery,
  useHideCommentMutation,
  useUnhideCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
