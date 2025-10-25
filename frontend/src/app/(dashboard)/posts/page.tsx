'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  useListPostsQuery,
  useHidePostMutation,
  useUnhidePostMutation,
  useDeletePostMutation,
} from '@/src/features/posts/api/postsApi';
import { toast } from 'sonner';

import { PostsHeader } from '@/src/components/posts/PostsHeader';
import { PostsTable } from '@/src/components/posts/PostsTable';
import { Pagination } from '@/src/components/posts/PostsPagination';

type StatusFilter = 'all' | 'visible' | 'hidden' | 'deleted';

export default function PostsManagementPage() {
  const router = useRouter();
  const { status } = useSession();

  const [search, setSearch] = useState('');
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [editContent, setEditContent] = useState('');
  const [editCaption, setEditCaption] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  const { data, isLoading } = useListPostsQuery({
    current,
    pageSize,
    search,
    status: statusFilter,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const [hidePost, { isLoading: hiding }] = useHidePostMutation();
  const [unhidePost, { isLoading: unhiding }] = useUnhidePostMutation();
  const [deletePost, { isLoading: deleting }] = useDeletePostMutation();

  // Chỉ show loading screen khi đang fetch data lần đầu
  const isInitialLoading = isLoading && !data;

  const handleHideToggle = async (id: string, isHidden: boolean) => {
    const action = isHidden ? 'Hiện' : 'Ẩn';
    const t = toast.loading(`${action} bài đăng...`);
    try {
      if (isHidden) await unhidePost(id).unwrap();
      else await hidePost(id).unwrap();
      toast.success(`${action} thành công`, { id: t });
    } catch (error: any) {
      toast.error(error?.data?.message || `${action} thất bại`, { id: t });
    }
  };

  const handleDelete = async (id: string) => {
    const t = toast.loading('Xóa bài đăng...');
    try {
      await deletePost(id).unwrap();
      toast.success('Xóa thành công', { id: t });
    } catch (error: any) {
      toast.error(error?.data?.message || 'Xóa thất bại', { id: t });
    }
  };

  // Chỉ show loading screen khi chưa có data hoặc đang authenticate
  if (status === 'loading' || isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-600">Đang tải danh sách bài đăng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PostsHeader
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={(v: string) => setStatusFilter(v as StatusFilter)}
          pageSize={pageSize}
          setPageSize={setPageSize}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <PostsTable
          items={data?.items || []}
          handleHideToggle={handleHideToggle}
          handleDelete={handleDelete}
          loadingStates={{ hiding, unhiding, deleting }}
        />
        <Pagination
          current={data?.pagination?.current || 1}
          totalPages={data?.pagination?.totalPages || 1}
          totalItems={data?.pagination?.totalItems || 0}
          setCurrent={setCurrent}
        />
      </div>
    </div>
  );
}
