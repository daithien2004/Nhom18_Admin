"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  useListUsersQuery,
  useBanUserMutation,
  useUnbanUserMutation,
  useVerifyUserMutation,
  useUnverifyUserMutation,
  useResetPasswordMutation,
  useGetUserQuery,
} from "@/src/features/users/api/usersApi";

export default function UsersManagementPage() {
  const router = useRouter();
  const { status } = useSession();
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const { data, isLoading, refetch } = useListUsersQuery({
    current,
    pageSize,
    search,
  });

  const [banUser, { isLoading: banning }] = useBanUserMutation();
  const [unbanUser, { isLoading: unbanning }] = useUnbanUserMutation();
  const [verifyUser, { isLoading: verifying }] = useVerifyUserMutation();
  const [unverifyUser, { isLoading: unverifying }] = useUnverifyUserMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  const loading =
    isLoading || banning || unbanning || verifying || unverifying || resetting;

  const items = data?.items || [];
  const pagination = data?.pagination || {
    current,
    pageSize,
    totalItems: 0,
    totalPages: 1,
  };

  const handleBanToggle = async (id: string, isBanned: boolean) => {
    try {
      if (isBanned) {
        await unbanUser(id).unwrap();
      } else {
        await banUser(id).unwrap();
      }
    } catch (error) {
      alert("Có lỗi xảy ra!");
    }
  };

  const handleVerifyToggle = async (id: string, isVerified: boolean) => {
    try {
      if (isVerified) {
        await unverifyUser(id).unwrap();
      } else {
        await verifyUser(id).unwrap();
      }
    } catch (error) {
      alert("Có lỗi xảy ra!");
    }
  };

  const handleResetPassword = async (id: string) => {
    const newPassword = prompt("Nhập mật khẩu mới (tối thiểu 6 ký tự):");
    if (!newPassword || newPassword.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    try {
      await resetPassword({ id, newPassword }).unwrap();
      alert("Reset mật khẩu thành công!");
    } catch (error) {
      alert("Có lỗi xảy ra!");
    }
  };

  const closeModal = () => setSelectedId(null);

  if (status === "loading" || loading) {
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
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý người dùng
          </h1>
          <div className="flex gap-3 items-center">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrent(1);
              }}
              placeholder="Tìm kiếm username, email, phone"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-72"
            />
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setCurrent(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}/trang
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Xác minh
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((u) => {
                const id = u._id;
                return (
                  <tr key={id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-sm font-medium text-indigo-600 hover:underline"
                        onClick={() => setSelectedId(id)}
                      >
                        {u.username}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.isBanned
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {u.isBanned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.isVerified
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {u.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => handleBanToggle(id, u.isBanned)}
                        disabled={banning || unbanning}
                        className={`px-3 py-1 rounded text-white ${
                          u.isBanned
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        } disabled:opacity-50`}
                      >
                        {u.isBanned ? "Unban" : "Ban"}
                      </button>
                      <button
                        onClick={() => handleVerifyToggle(id, u.isVerified)}
                        disabled={verifying || unverifying}
                        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                      >
                        {u.isVerified ? "Unverify" : "Verify"}
                      </button>
                      <button
                        onClick={() => handleResetPassword(id)}
                        disabled={resetting}
                        className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-800 text-white disabled:opacity-50"
                      >
                        Reset PW
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              Không có dữ liệu
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Tổng: {pagination.totalItems}
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
              disabled={pagination.current <= 1}
              onClick={() => setCurrent((c) => Math.max(1, c - 1))}
            >
              Trước
            </button>
            <span className="px-3 py-2">
              Trang {pagination.current}/{pagination.totalPages}
            </span>
            <button
              className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
              disabled={pagination.current >= pagination.totalPages}
              onClick={() => setCurrent((c) => c + 1)}
            >
              Sau
            </button>
          </div>
        </div>

        {/* Modal */}
        {selectedId && <UserDetailModal id={selectedId} onClose={closeModal} />}
      </div>
    </div>
  );
}

function UserDetailModal({ id, onClose }: { id: string; onClose: () => void }) {
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
