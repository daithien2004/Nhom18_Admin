'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  useGetDashboardStatsQuery,
  useGetActiveUsersQuery,
  useGetRecentReportsQuery,
  useGetRecentActivitiesQuery,
} from '@/src/features/dashboard/api/dashboardApi';
import StatsCard from '@/src/components/dashboard/StatsCard';
import ActiveUsersList from '@/src/components/dashboard/ActiveUsersList';
import RecentReportsList from '@/src/components/dashboard/RecentReportsList';
import RecentActivitiesList from '@/src/components/dashboard/RecentActivitiesList';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const router = useRouter();
  const { status } = useSession();
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d'>(
    '24h'
  );

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // RTK Query hooks
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useGetDashboardStatsQuery({ period: selectedPeriod });

  const {
    data: activeUsers = [],
    isLoading: usersLoading,
    error: usersError,
  } = useGetActiveUsersQuery({ limit: 10 });

  const {
    data: recentReports = [],
    isLoading: reportsLoading,
    error: reportsError,
  } = useGetRecentReportsQuery({ limit: 10 });

  const {
    data: recentActivities = [],
    isLoading: activitiesLoading,
    error: activitiesError,
  } = useGetRecentActivitiesQuery({ limit: 20 });

  const loading =
    statsLoading || usersLoading || reportsLoading || activitiesLoading;

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">
            Đang tải bảng điều khiển...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển</h1>
          <p className="mt-2 text-gray-600">
            Tổng quan hoạt động hệ thống ZaloUTE
          </p>
        </div>

        <select
          value={selectedPeriod}
          onChange={(e) =>
            setSelectedPeriod(e.target.value as '24h' | '7d' | '30d')
          }
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm font-medium"
        >
          <option value="24h">24 giờ qua</option>
          <option value="7d">7 ngày qua</option>
          <option value="30d">30 ngày qua</option>
        </select>
      </div>

      {/* Error Messages */}
      {(statsError || usersError || reportsError || activitiesError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-red-500 text-xl">⚠️</span>
            <div>
              <h3 className="text-red-800 font-semibold">Có lỗi xảy ra</h3>
              <p className="text-red-700 text-sm mt-1">
                Không thể tải một số dữ liệu. Vui lòng thử lại sau.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatsCard
            title="Tổng người dùng"
            value={stats.totalUsers}
            change={
              stats.newUsers > 0
                ? Math.round((stats.newUsers / stats.totalUsers) * 100)
                : 0
            }
            changeType={stats.newUsers > 0 ? 'increase' : 'neutral'}
            icon={<span className="text-2xl">👥</span>}
            color="blue"
          />
          <StatsCard
            title="Người dùng mới"
            value={stats.newUsers}
            icon={<span className="text-2xl">🆕</span>}
            color="green"
          />
          <StatsCard
            title="Bài viết mới"
            value={stats.newPosts}
            icon={<span className="text-2xl">📝</span>}
            color="purple"
          />
          <StatsCard
            title="Bình luận mới"
            value={stats.newComments}
            icon={<span className="text-2xl">💬</span>}
            color="indigo"
          />
          <StatsCard
            title="Báo cáo vi phạm"
            value={stats.newReports}
            icon={<span className="text-2xl">⚠️</span>}
            color="red"
          />
          <StatsCard
            title="Báo cáo chờ xử lý"
            value={stats.pendingReports}
            icon={<span className="text-2xl">⏳</span>}
            color="yellow"
          />
          <StatsCard
            title="Người dùng hoạt động"
            value={stats.activeUsers24h}
            icon={<span className="text-2xl">🔥</span>}
            color="green"
          />
          <StatsCard
            title="Báo cáo đã xử lý"
            value={stats.resolvedReports}
            icon={<span className="text-2xl">✅</span>}
            color="blue"
          />
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveUsersList users={activeUsers} loading={loading} />
        <RecentReportsList reports={recentReports} loading={loading} />
      </div>

      {/* Recent Activities */}
      <RecentActivitiesList activities={recentActivities} loading={loading} />
    </div>
  );
}
