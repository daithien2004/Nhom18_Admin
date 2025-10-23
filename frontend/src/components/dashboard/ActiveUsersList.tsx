'use client';

import { UserActivity } from '@/src/types/dashboard';

interface ActiveUsersListProps {
  users: UserActivity[];
  loading?: boolean;
}

export default function ActiveUsersList({ users, loading = false }: ActiveUsersListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Người dùng hoạt động</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Người dùng hoạt động</h3>
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.username}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500">
                  Hoạt động cuối: {new Date(user.lastActivity).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <div className="flex space-x-4">
                <span>{user.postCount} bài viết</span>
                <span>{user.commentCount} bình luận</span>
                <span>{user.likeCount} lượt thích</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
