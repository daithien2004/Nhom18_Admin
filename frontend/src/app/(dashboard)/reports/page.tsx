'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ReportsManagement from '@/src/components/reports/ReportsManagement';

export default function ReportsPage() {
  const router = useRouter();
  const { status } = useSession();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý báo cáo</h1>
        <p className="mt-2 text-gray-600">
          Xem và xử lý các báo cáo vi phạm từ người dùng
        </p>
      </div>

      {/* Reports Management Component */}
      <ReportsManagement />
    </div>
  );
}
