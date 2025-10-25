export interface Author {
  _id: string;
  username: string;
}

export interface Comment {
  _id: string;
  author: Author;
  content: string;
  postId: {
    _id: string;
    content: string;
    author: Author;
  };
  isHidden: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommentListResponse {
  items: Comment[];
  pagination: {
    current: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ListCommentsQuery {
  current?: number;
  pageSize?: number;
  search?: string;
  status?: "all" | "visible" | "hidden" | "deleted";
  author?: Author;
  startDate?: string;
  endDate?: string;
}
