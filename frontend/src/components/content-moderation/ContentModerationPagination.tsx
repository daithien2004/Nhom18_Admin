"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// Toan: Pagination component for content moderation
interface ContentModerationPaginationProps {
  current: number;
  totalPages: number;
  totalItems: number;
  setCurrent: (page: number) => void;
}

export function ContentModerationPagination({
  current,
  totalPages,
  totalItems,
  setCurrent,
}: ContentModerationPaginationProps) {
  // Toan: Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, current - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Hiển thị {totalItems} bài đăng
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Hiển thị trang {current} của {totalPages} ({totalItems} bài đăng)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Toan: First page button */}
          <button
            onClick={() => setCurrent(1)}
            disabled={current === 1}
            className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Toan: Previous page button */}
          <button
            onClick={() => setCurrent(current - 1)}
            disabled={current === 1}
            className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Toan: Page numbers */}
          <div className="flex items-center space-x-1">
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => setCurrent(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md border ${
                  current === page
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Toan: Next page button */}
          <button
            onClick={() => setCurrent(current + 1)}
            disabled={current === totalPages}
            className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Toan: Last page button */}
          <button
            onClick={() => setCurrent(totalPages)}
            disabled={current === totalPages}
            className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
