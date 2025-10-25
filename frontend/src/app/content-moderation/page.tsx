"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  useSearchInappropriatePostsQuery,
  useHideInappropriatePostMutation,
  useUnhidePostMutation,
  useDeleteInappropriatePostMutation,
} from "@/src/features/content-moderation/api/content-moderation-api";
import { toast } from "sonner";

import { ContentModerationHeader } from "@/src/components/content-moderation/ContentModerationHeader";
import { InappropriatePostsTable } from "@/src/components/content-moderation/InappropriatePostsTable";
import { ContentModerationPagination } from "@/src/components/content-moderation/ContentModerationPagination";

// Toan: Main page for content moderation functionality
type StatusFilter = "all" | "visible" | "hidden" | "deleted";

export default function ContentModerationPage() {
  const router = useRouter();
  const { status } = useSession();

  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const { data, isLoading } = useSearchInappropriatePostsQuery({
    current,
    pageSize,
    search,
    status: statusFilter,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const [hidePost, { isLoading: hiding }] = useHideInappropriatePostMutation();
  const [unhidePost, { isLoading: unhiding }] = useUnhidePostMutation();
  const [deletePost, { isLoading: deleting }] =
    useDeleteInappropriatePostMutation();

  const loading = isLoading || hiding || unhiding || deleting;

  // Toan: Handle hide/unhide inappropriate posts
  const handleHideToggle = async (id: string, isHidden: boolean) => {
    const action = isHidden ? "Hiện" : "Ẩn";
    const t = toast.loading(`${action} bài đăng không phù hợp...`);
    try {
      if (isHidden) await unhidePost(id).unwrap();
      else await hidePost(id).unwrap();
      toast.success(`${action} thành công`, { id: t });
    } catch (error: any) {
      toast.error(error?.data?.message || `${action} thất bại`, { id: t });
    }
  };

  // Toan: Handle delete inappropriate posts permanently
  const handleDelete = async (id: string) => {
    const t = toast.loading("Xóa bài đăng không phù hợp...");
    try {
      await deletePost(id).unwrap();
      toast.success("Xóa thành công", { id: t });
    } catch (error: any) {
      toast.error(error?.data?.message || "Xóa thất bại", { id: t });
    }
  };

  if (status === "loading" || loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-600">
            Đang tải danh sách bài đăng không phù hợp...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Toan: Header with search and filters */}
        <ContentModerationHeader
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

        {/* Toan: Table showing inappropriate posts */}
        <InappropriatePostsTable
          items={data?.items || []}
          handleHideToggle={handleHideToggle}
          handleDelete={handleDelete}
          loadingStates={{ hiding, unhiding, deleting }}
        />

        {/* Toan: Pagination */}
        <ContentModerationPagination
          current={data?.pagination?.current || 1}
          totalPages={data?.pagination?.totalPages || 1}
          totalItems={data?.pagination?.totalItems || 0}
          setCurrent={setCurrent}
        />
      </div>
    </div>
  );
}
