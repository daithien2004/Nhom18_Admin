'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useGetDashboardStatsQuery, useGetActiveUsersQuery, useGetRecentReportsQuery, useGetRecentActivitiesQuery } from '@/src/features/dashboard/api/dashboardApi';
import StatsCard from '@/src/components/dashboard/StatsCard';
import ActiveUsersList from '@/src/components/dashboard/ActiveUsersList';
import RecentReportsList from '@/src/components/dashboard/RecentReportsList';
import RecentActivitiesList from '@/src/components/dashboard/RecentActivitiesList';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d'>('24h');

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
    error: statsError 
  } = useGetDashboardStatsQuery({ period: selectedPeriod });

  const { 
    data: activeUsers = [], 
    isLoading: usersLoading, 
    error: usersError 
  } = useGetActiveUsersQuery({ limit: 10 });

  const { 
    data: recentReports = [], 
    isLoading: reportsLoading, 
    error: reportsError 
  } = useGetRecentReportsQuery({ limit: 10 });

  const { 
    data: recentActivities = [], 
    isLoading: activitiesLoading, 
    error: activitiesError 
  } = useGetRecentActivitiesQuery({ limit: 20 });

  const loading = statsLoading || usersLoading || reportsLoading || activitiesLoading;

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === 'authenticated' && session?.user) {
    const { user } = session;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                {user.image && (
                  <div className="relative">
                    <Image
                      src={user.image}
                      alt={user.username || 'User Image'}
                      width={60}
                      height={60}
                      className="rounded-full ring-4 ring-indigo-100"
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard Admin
                  </h1>
                  <p className="text-gray-600">Xin chào, {user.username || user.name}!</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as '24h' | '7d' | '30d')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="24h">24 giờ qua</option>
                  <option value="7d">7 ngày qua</option>
                  <option value="30d">30 ngày qua</option>
                </select>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Tổng người dùng"
                value={stats.totalUsers}
                change={stats.newUsers > 0 ? Math.round((stats.newUsers / stats.totalUsers) * 100) : 0}
                changeType={stats.newUsers > 0 ? 'increase' : 'neutral'}
                icon={<span className="text-xl">👥</span>}
                color="blue"
              />
              <StatsCard
                title="Người dùng mới"
                value={stats.newUsers}
                icon={<span className="text-xl">🆕</span>}
                color="green"
              />
              <StatsCard
                title="Bài viết mới"
                value={stats.newPosts}
                icon={<span className="text-xl">📝</span>}
                color="purple"
              />
              <StatsCard
                title="Bình luận mới"
                value={stats.newComments}
                icon={<span className="text-xl">💬</span>}
                color="indigo"
              />
              <StatsCard
                title="Báo cáo vi phạm"
                value={stats.newReports}
                icon={<span className="text-xl">⚠️</span>}
                color="red"
              />
              <StatsCard
                title="Báo cáo chờ xử lý"
                value={stats.pendingReports}
                icon={<span className="text-xl">⏳</span>}
                color="yellow"
              />
              <StatsCard
                title="Người dùng hoạt động (24h)"
                value={stats.activeUsers24h}
                icon={<span className="text-xl">🔥</span>}
                color="green"
              />
              <StatsCard
                title="Báo cáo đã xử lý"
                value={stats.resolvedReports}
                icon={<span className="text-xl">✅</span>}
                color="blue"
              />
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ActiveUsersList users={activeUsers} loading={loading} />
            <RecentReportsList reports={recentReports} loading={loading} />
          </div>

          {/* Recent Activities */}
          <div className="mt-8">
            <RecentActivitiesList activities={recentActivities} loading={loading} />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
