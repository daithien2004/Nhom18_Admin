import React from "react";

type Props = {
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  pageSize: number;
  setPageSize: (v: number) => void;
  startDate: string;
  endDate: string;
  setStartDate: (v: string) => void;
  setEndDate: (v: string) => void;
};

export const CommentsHeader: React.FC<Props> = ({
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
}) => (
  <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
    {/* Hàng 1: Tiêu đề + Page size */}
    <div className="flex justify-between items-center flex-wrap gap-4">
      <h1 className="text-2xl font-bold text-gray-900">Quản lý bình luận</h1>
      <select
        value={pageSize}
        onChange={(e) => setPageSize(parseInt(e.target.value))}
        className="px-3 py-2 border border-gray-300 rounded-lg"
      >
        {[10, 20, 50].map((n) => (
          <option key={n} value={n}>
            {n} / trang
          </option>
        ))}
      </select>
    </div>

    {/* Hàng 2: Filter + Search + Date */}
    <div className="flex flex-row justify-between items-center gap-4 flex-nowrap">
      {/* Phần trạng thái + search */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg flex-shrink-0"
        >
          <option value="all">Tất cả</option>
          <option value="visible">Hiển thị</option>
          <option value="hidden">Đang ẩn</option>
          <option value="deleted">Đã xóa</option>
        </select>

        <div className="w-64">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm nội dung comment"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Phần lọc ngày */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <label className="text-sm">Từ:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded-lg"
        />
        <label className="text-sm">Đến:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded-lg"
        />
      </div>
    </div>
  </div>
);
