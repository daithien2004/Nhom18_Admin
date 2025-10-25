"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Post } from "@/src/features/content-moderation/types/content-moderation";

// Toan: Table component for displaying inappropriate posts
interface InappropriatePostsTableProps {
  items: Post[];
  handleHideToggle: (id: string, isHidden: boolean) => void;
  handleDelete: (id: string) => void;
  loadingStates: {
    hiding: boolean;
    unhiding: boolean;
    deleting: boolean;
  };
}

export function InappropriatePostsTable({
  items,
  handleHideToggle,
  handleDelete,
  loadingStates,
}: InappropriatePostsTableProps) {
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  // Toan: Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Toan: Truncate content for preview
  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không tìm thấy bài đăng không phù hợp
        </h3>
        <p className="text-gray-500">
          Không có bài đăng nào phù hợp với tiêu chí tìm kiếm của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Danh sách bài đăng không phù hợp
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Tổng cộng {items.length} bài đăng được tìm thấy
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nội dung
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tác giả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((post) => (
              <tr key={post._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {post.caption || "Không có tiêu đề"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {expandedPost === post._id
                        ? post.content
                        : truncateContent(post.content)}
                    </div>
                    {post.content.length > 100 && (
                      <button
                        onClick={() =>
                          setExpandedPost(
                            expandedPost === post._id ? null : post._id
                          )
                        }
                        className="text-xs text-indigo-600 hover:text-indigo-800 mt-1"
                      >
                        {expandedPost === post._id ? "Thu gọn" : "Xem thêm"}
                      </button>
                    )}
                    {post.images && post.images.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        📷 {post.images.length} hình ảnh
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {post.author?.username || "Không xác định"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      post.isDeleted
                        ? "bg-red-100 text-red-800"
                        : post.isHidden
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {post.isDeleted
                      ? "Đã xóa"
                      : post.isHidden
                      ? "Đã ẩn"
                      : "Hiển thị"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(post.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    {/* Toan: Hide/Unhide button */}
                    <button
                      onClick={() => handleHideToggle(post._id, post.isHidden)}
                      disabled={loadingStates.hiding || loadingStates.unhiding}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                        post.isHidden
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      } disabled:opacity-50`}
                    >
                      {post.isHidden ? (
                        <Eye className="w-3 h-3 mr-1" />
                      ) : (
                        <EyeOff className="w-3 h-3 mr-1" />
                      )}
                      {post.isHidden ? "Hiện" : "Ẩn"}
                    </button>

                    {/* Toan: Delete button */}
                    <button
                      onClick={() => handleDelete(post._id)}
                      disabled={loadingStates.deleting}
                      className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
