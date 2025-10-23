'use client';

import { Activity } from '@/src/features/dashboard';

interface RecentActivitiesListProps {
  activities: Activity[];
  loading?: boolean;
}

export default function RecentActivitiesList({
  activities,
  loading = false,
}: RecentActivitiesListProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      default:
        return '📝';
    }
  };

  const getActivityText = (activity: Activity) => {
    const actor = activity.actor.username;
    const postOwner = activity.postOwner.username;

    if (activity.type === 'like') {
      return `${actor} đã thích bài viết của ${postOwner}`;
    } else if (activity.type === 'comment') {
      return `${actor} đã bình luận bài viết của ${postOwner}`;
    }
    return `${actor} đã tương tác với bài viết của ${postOwner}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hoạt động gần đây
        </h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Hoạt động gần đây
      </h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {getActivityText(activity)}
              </p>
              {/* <p className="text-xs text-gray-500 truncate">
                {activity.post.content.length > 50
                  ? `${activity.post.content.substring(0, 50)}...`
                  : activity.post.content}
              </p> */}
              {activity.comment && (
                <p className="text-xs text-gray-600 mt-1">
                  Bình luận:{' '}
                  {activity.comment.content.length > 30
                    ? `${activity.comment.content.substring(0, 30)}...`
                    : activity.comment.content}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(activity.createdAt).toLocaleString('vi-VN')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
