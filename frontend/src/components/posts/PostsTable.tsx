import React from 'react';
import { toast } from 'sonner';

type Post = {
  id: string;
  content: string;
  caption?: string;
  isHidden: boolean;
  isDeleted: boolean;
  createdAt: string;
  author: { id: string; username: string };
};

type Props = {
  items: Post[];
  handleHideToggle: (id: string, isHidden: boolean) => void;
  handleDelete: (id: string) => void;
  loadingStates: {
    hiding: boolean;
    unhiding: boolean;
    deleting: boolean;
  };
};

export const PostsTable: React.FC<Props> = ({
  items,
  handleHideToggle,
  handleDelete,
  loadingStates,
}) => {
  const { hiding, unhiding, deleting } = loadingStates;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-30">
              Tác giả
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nội dung
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              Thời gian đăng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-30">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-72">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((p) => {
            return (
              <tr key={p.id} className="hover:bg-gray-50 align-top">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-24 truncate max-w-[6rem]">
                  {p.author.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-20 truncate max-w-[6rem]">
                  {p.author.username}
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                      {p.content}
                    </p>
                    {p.caption && (
                      <p className="text-xs text-gray-500">{p.caption}</p>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-32">
                  {new Date(p.createdAt).toLocaleString()}{' '}
                  {/* Hiển thị ngày giờ đẹp */}
                </td>

                <td className="px-6 py-4 whitespace-nowrap w-24">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      p.isDeleted
                        ? 'bg-red-100 text-red-800'
                        : p.isHidden
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {p.isDeleted
                      ? 'Đã xóa'
                      : p.isHidden
                      ? 'Đang ẩn'
                      : 'Hiển thị'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right w-72 space-x-1">
                  <button
                    onClick={() => handleHideToggle(p.id, p.isHidden)}
                    disabled={hiding || unhiding}
                    className="h-8 px-2 text-xs rounded font-medium bg-yellow-600 text-white disabled:opacity-50"
                  >
                    {p.isHidden ? 'Hiện' : 'Ẩn'}
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting}
                    className="h-8 px-2 text-xs rounded font-medium bg-red-600 text-white disabled:opacity-50"
                  >
                    Xóa
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
};
