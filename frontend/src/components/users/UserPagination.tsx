"use client";

interface Pagination {
  current: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface UserPaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export default function UserPagination({
  pagination,
  onPageChange,
}: UserPaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600">Tổng: {pagination.totalItems}</div>
      <div className="flex gap-2">
        <button
          className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={pagination.current <= 1}
          onClick={() => onPageChange(Math.max(1, pagination.current - 1))}
        >
          Trước
        </button>
        <span className="px-3 py-2">
          Trang {pagination.current}/{pagination.totalPages}
        </span>
        <button
          className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={pagination.current >= pagination.totalPages}
          onClick={() => onPageChange(pagination.current + 1)}
        >
          Sau
        </button>
      </div>
    </div>
  );
}
