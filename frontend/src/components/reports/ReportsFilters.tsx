'use client';

import { ReportsQuery } from '@/src/features/reports';
import { useState } from 'react';

interface ReportsFiltersProps {
  filters: ReportsQuery;
  onFilterChange: (filters: Partial<ReportsQuery>) => void;
}

export default function ReportsFilters({
  filters,
  onFilterChange,
}: ReportsFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ReportsQuery>(filters);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange({ [key]: value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: localFilters.search });
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: undefined,
      reportType: undefined,
      reason: '',
      search: '',
    };
    setLocalFilters({ ...localFilters, ...clearedFilters });
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Xóa bộ lọc
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <select
            value={localFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Tất cả</option>
            <option value="pending">Chờ xử lý</option>
            <option value="reviewing">Đang xem xét</option>
            <option value="resolved">Đã xử lý</option>
            <option value="dismissed">Đã bỏ qua</option>
          </select>
        </div>

        {/* Report Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại báo cáo
          </label>
          <select
            value={localFilters.reportType}
            onChange={(e) => handleFilterChange('reportType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Tất cả</option>
            <option value="user">Người dùng</option>
            <option value="post">Bài viết</option>
            <option value="comment">Bình luận</option>
          </select>
        </div>

        {/* Reason Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lý do
          </label>
          <select
            value={localFilters.reason}
            onChange={(e) => handleFilterChange('reason', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Tất cả</option>
            <option value="spam">Spam</option>
            <option value="inappropriate_content">
              Nội dung không phù hợp
            </option>
            <option value="harassment">Quấy rối</option>
            <option value="fake_information">Thông tin giả</option>
            <option value="violence">Bạo lực</option>
            <option value="hate_speech">Ngôn từ thù địch</option>
            <option value="other">Khác</option>
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm
          </label>
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={localFilters.search}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, search: e.target.value })
              }
              placeholder="Tìm kiếm..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors"
            >
              🔍
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
