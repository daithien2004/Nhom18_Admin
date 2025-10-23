"use client";

import { useGetUserQuery } from "@/src/features/users/api/usersApi";

interface UserDetailModalProps {
  id: string;
  onClose: () => void;
}

export default function UserDetailModal({ id, onClose }: UserDetailModalProps) {
  const { data, isLoading } = useGetUserQuery(id);
  const user = data;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Chi tiết người dùng</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="py-10 text-center text-gray-600">Đang tải...</div>
          ) : user ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Username</span>
                <span className="font-semibold">{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Email</span>
                <span className="font-semibold">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Phone</span>
                <span>{user.phone || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Verified</span>
                <span className="font-semibold">
                  {user.isVerified ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Banned</span>
                <span className="font-semibold">
                  {user.isBanned ? "Yes" : "No"}
                </span>
              </div>
              {user.bio && (
                <div>
                  <span className="text-gray-600 font-medium block mb-1">
                    Bio
                  </span>
                  <p className="text-gray-900">{user.bio}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-600">
              Không tìm thấy user
            </div>
          )}
        </div>
        <div className="p-6 border-t text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
