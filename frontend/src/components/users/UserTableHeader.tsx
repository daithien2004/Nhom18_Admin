"use client";

interface UserTableHeaderProps {
  search: string;
  pageSize: number;
  onSearchChange: (value: string) => void;
  onPageSizeChange: (size: number) => void;
}

export default function UserTableHeader({
  search,
  pageSize,
  onSearchChange,
  onPageSizeChange,
}: UserTableHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
      <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
      <div className="flex gap-3 items-center">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm username, email, phone"
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-72"
        />
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n} / trang
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
