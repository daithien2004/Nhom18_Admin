import React from 'react';
import { toast } from 'sonner';

type Comment = {
  id: string;
  content: string;
  isHidden: boolean;
  isDeleted: boolean;
  createdAt: string;
  author?: { id: string; username: string } | null;
  postId: {
    id: string;
    content: string;
    caption: string;
    author: { id: string; username: string };
  };
};

type Props = {
  items: Comment[];
  handleHideToggle: (id: string, isHidden: boolean) => void;
  handleDelete: (id: string) => void;
  loadingStates: {
    hiding: boolean;
    unhiding: boolean;
    deleting: boolean;
  };
};

export const CommentsTable: React.FC<Props> = ({
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
              Nội dung comment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bài đăng gốc
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
          {items.map((comment) => {
            return (
              <tr key={comment.id} className="hover:bg-gray-50 align-top">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-24 truncate max-w-[6rem]">
                  {comment.author?.id || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-20 truncate max-w-[6rem]">
                  {comment.author?.username || 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap break-words max-w-xs">
                      {comment.postId?.content ??
                        comment.postId?.caption ??
                        '(Không có dữ liệu)'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Tác giả: {comment.postId?.author?.username ?? 'N/A'}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-32">
                  {new Date(comment.createdAt).toLocaleString()}
                </td>

                <td className="px-6 py-4 whitespace-nowrap w-24">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      comment.isDeleted
                        ? 'bg-red-100 text-red-800'
                        : comment.isHidden
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {comment.isDeleted
                      ? 'Đã xóa'
                      : comment.isHidden
                      ? 'Đang ẩn'
                      : 'Hiển thị'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right w-72 space-x-1">
                  <button
                    onClick={() =>
                      handleHideToggle(comment.id, comment.isHidden)
                    }
                    disabled={hiding || unhiding}
                    className="h-8 px-2 text-xs rounded font-medium bg-yellow-600 text-white disabled:opacity-50"
                  >
                    {comment.isHidden ? 'Hiện' : 'Ẩn'}
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
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
