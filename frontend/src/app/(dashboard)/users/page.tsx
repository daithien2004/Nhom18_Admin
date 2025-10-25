'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  useListUsersQuery,
  useBanUserMutation,
  useUnbanUserMutation,
  useVerifyUserMutation,
  useUnverifyUserMutation,
  useResetPasswordMutation,
} from '@/src/features/users/api/usersApi';
import { toast } from 'sonner';

import UserTableHeader from '@/src/components/users/UserTableHeader';
import UserTable from '@/src/components/users/UserTable';
import UserPagination from '@/src/components/users/UserPagination';
import UserDetailModal from '@/src/components/users/UserDetailModal';

export default function UsersManagementPage() {
  const router = useRouter();
  const { status } = useSession();
  const [search, setSearch] = useState('');
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  const { data, isLoading } = useListUsersQuery({ current, pageSize, search });

  const [banUser, { isLoading: banning }] = useBanUserMutation();
  const [unbanUser, { isLoading: unbanning }] = useUnbanUserMutation();
  const [verifyUser, { isLoading: verifying }] = useVerifyUserMutation();
  const [unverifyUser, { isLoading: unverifying }] = useUnverifyUserMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  // Chỉ show loading screen khi đang fetch data lần đầu
  const isInitialLoading = isLoading && !data;

  const items = data?.items || [];
  const pagination = data?.pagination || {
    current,
    pageSize,
    totalItems: 0,
    totalPages: 1,
  };

  const handleBanToggle = async (id: string, isBanned: boolean) => {
    const action = isBanned ? 'Mở khóa' : 'Khóa';
    const t = toast.loading(`${action} người dùng...`);
    try {
      if (isBanned) await unbanUser(id).unwrap();
      else await banUser(id).unwrap();
      toast.success(`${action} thành công`, { id: t });
    } catch (error: any) {
      toast.error(
        error?.data?.message || `Không ${action.toLowerCase()} được`,
        { id: t }
      );
    }
  };

  const handleVerifyToggle = async (id: string, isVerified: boolean) => {
    const action = isVerified ? 'Bỏ xác minh' : 'Xác minh';
    const t = toast.loading(`${action}...`);
    try {
      if (isVerified) await unverifyUser(id).unwrap();
      else await verifyUser(id).unwrap();
      toast.success(`${action} thành công`, { id: t });
    } catch (error: any) {
      toast.error(error?.data?.message || `${action} thất bại`, { id: t });
    }
  };

  // Chỉ show loading screen khi chưa có data hoặc đang authenticate
  if (status === 'loading' || isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-600">Đang tải danh sách người dùng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <UserTableHeader
          search={search}
          pageSize={pageSize}
          onSearchChange={(value) => {
            setSearch(value);
            setCurrent(1);
          }}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrent(1);
          }}
        />

        <UserTable
          items={items}
          onUserClick={setSelectedId}
          onBanToggle={handleBanToggle}
          onVerifyToggle={handleVerifyToggle}
          banning={banning}
          unbanning={unbanning}
          verifying={verifying}
          unverifying={unverifying}
          resetting={resetting}
        />

        <UserPagination pagination={pagination} onPageChange={setCurrent} />

        {selectedId && (
          <UserDetailModal
            id={selectedId}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
    </div>
  );
}
