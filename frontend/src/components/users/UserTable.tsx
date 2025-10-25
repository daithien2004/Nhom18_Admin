'use client';

interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  isBanned: boolean;
  isVerified: boolean;
}

interface UserTableProps {
  items: User[];
  onUserClick: (id: string) => void;
  onBanToggle: (id: string, isBanned: boolean) => void;
  onVerifyToggle: (id: string, isVerified: boolean) => void;
  banning: boolean;
  unbanning: boolean;
  verifying: boolean;
  unverifying: boolean;
  resetting: boolean;
}

export default function UserTable({
  items,
  onUserClick,
  onBanToggle,
  onVerifyToggle,
  banning,
  unbanning,
  verifying,
  unverifying,
  resetting,
}: UserTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              Số điện thoại
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              Xác minh
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-52">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((u) => {
            return (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap w-24">
                  <button
                    className="text-sm font-medium text-indigo-600 hover:underline"
                    onClick={() => onUserClick(u.id)}
                  >
                    {u.username}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-48 truncate max-w-[12rem]">
                  {u.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-32 truncate max-w-[8rem]">
                  {u.phone || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap w-20">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      u.isBanned
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {u.isBanned ? 'Bị khóa' : 'Hoạt động'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap w-24">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      u.isVerified
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {u.isVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right w-52 space-x-1">
                  <button
                    onClick={() => onBanToggle(u.id, u.isBanned)}
                    disabled={banning || unbanning}
                    className="w-20 h-8 px-1 text-xs rounded font-medium text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    style={{
                      backgroundColor: u.isBanned ? '#10b981' : '#ef4444',
                    }}
                  >
                    {u.isBanned ? 'Mở khóa' : 'Khóa'}
                  </button>
                  <button
                    onClick={() => onVerifyToggle(u.id, u.isVerified)}
                    disabled={verifying || unverifying}
                    className="w-22 h-8 px-1 text-xs rounded font-medium bg-blue-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-blue-700"
                  >
                    {u.isVerified ? 'Bỏ xác minh' : 'Xác minh'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {items.length === 0 && (
        <div className="p-6 text-center text-gray-500">Không có dữ liệu</div>
      )}
    </div>
  );
}
