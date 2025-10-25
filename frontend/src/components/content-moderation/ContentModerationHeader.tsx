"use client";

import { Search, Filter, Calendar, Users } from "lucide-react";

// Toan: Header component for content moderation with search and filters
interface ContentModerationHeaderProps {
  search: string;
  setSearch: (search: string) => void;
  statusFilter: "all" | "visible" | "hidden" | "deleted";
  setStatusFilter: (status: string) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

export function ContentModerationHeader({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  pageSize,
  setPageSize,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: ContentModerationHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Toan: Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm bài đăng không phù hợp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Toan: Status filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tất cả</option>
              <option value="visible">Hiển thị</option>
              <option value="hidden">Đã ẩn</option>
              <option value="deleted">Đã xóa</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Toan: Date range filters */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Từ ngày"
            />
            <span className="text-gray-400">đến</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Đến ngày"
            />
          </div>

          {/* Toan: Page size selector */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={5}>5 bài/trang</option>
              <option value={10}>10 bài/trang</option>
              <option value={20}>20 bài/trang</option>
              <option value={50}>50 bài/trang</option>
            </select>
          </div>
        </div>
      </div>

      {/* Toan: Clear filters button */}
      {(search || statusFilter !== "all" || startDate || endDate) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setStartDate("");
              setEndDate("");
            }}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
