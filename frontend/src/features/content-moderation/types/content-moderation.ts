// Toan: Types for content moderation functionality
export interface Author {
  _id: string;
  username: string;
}

export interface Post {
  _id: string;
  author: Author;
  content: string;
  caption?: string;
  images: string[];
  likes: string[];
  comments: string[];
  views: number;
  shares: string[];
  sharedFrom?: string | null;
  isHidden: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostListResponse {
  items: Post[];
  pagination: {
    current: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface SearchInappropriatePostsQuery {
  current?: number;
  pageSize?: number;
  search?: string;
  status?: "all" | "visible" | "hidden" | "deleted";
  author?: string;
  startDate?: string;
  endDate?: string;
}

export interface ModerationStats {
  inappropriatePosts: number;
}
