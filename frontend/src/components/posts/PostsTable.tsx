import React from "react";
import { toast } from "sonner";

type Post = {
  _id: string;
  content: string;
  caption?: string;
  isHidden: boolean;
  isDeleted: boolean;
  createdAt: string;
  author: { _id: string; username: string };
};

type Props = {
  items: Post[];
  editingId: string | null;
  editContent: string;
  editCaption: string;
  setEditingId: (id: string | null) => void;
  setEditContent: (v: string) => void;
  setEditCaption: (v: string) => void;
  submitEdit: () => void;
  handleHideToggle: (id: string, isHidden: boolean) => void;
  handleDelete: (id: string) => void;
  loadingStates: {
    updating: boolean;
    hiding: boolean;
    unhiding: boolean;
    deleting: boolean;
  };
};

export const PostsTable: React.FC<Props> = ({
  items,
  editingId,
  editContent,
  editCaption,
  setEditingId,
  setEditContent,
  setEditCaption,
  submitEdit,
  handleHideToggle,
  handleDelete,
  loadingStates,
}) => {
  const isEditing = Boolean(editingId);
  const { updating, hiding, unhiding, deleting } = loadingStates;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-30">
              Tác giả
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nội dung
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              Thời gian đăng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-30">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-72">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((p) => {
            const isRowEditing = isEditing && editingId === p._id;
            return (
              <tr key={p._id} className="hover:bg-gray-50 align-top">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-24 truncate max-w-[6rem]">
                  {p.author._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-20 truncate max-w-[6rem]">
                  {p.author.username}
                </td>
                <td className="px-6 py-4">
                  {isRowEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full border rounded p-2 text-sm"
                        rows={3}
                      />
                      <input
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        placeholder="Caption (tuỳ chọn)"
                        className="w-full border rounded p-2 text-sm"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                        {p.content}
                      </p>
                      {p.caption && (
                        <p className="text-xs text-gray-500">{p.caption}</p>
                      )}
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-32">
                  {new Date(p.createdAt).toLocaleString()}{" "}
                  {/* Hiển thị ngày giờ đẹp */}
                </td>

                <td className="px-6 py-4 whitespace-nowrap w-24">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      p.isDeleted
                        ? "bg-red-100 text-red-800"
                        : p.isHidden
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {p.isDeleted
                      ? "Đã xóa"
                      : p.isHidden
                      ? "Đang ẩn"
                      : "Hiển thị"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right w-72 space-x-1">
                  {isRowEditing ? (
                    <>
                      <button
                        onClick={submitEdit}
                        disabled={updating}
                        className="h-8 px-2 text-xs rounded font-medium bg-green-600 text-white disabled:opacity-50"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="h-8 px-2 text-xs rounded font-medium bg-gray-200 text-gray-800"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(p._id);
                          setEditContent(p.content);
                          setEditCaption(p.caption || "");
                        }}
                        className="h-8 px-2 text-xs rounded font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleHideToggle(p._id, p.isHidden)}
                        disabled={hiding || unhiding}
                        className="h-8 px-2 text-xs rounded font-medium bg-yellow-600 text-white disabled:opacity-50"
                      >
                        {p.isHidden ? "Hiện" : "Ẩn"}
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        disabled={deleting}
                        className="h-8 px-2 text-xs rounded font-medium bg-red-600 text-white disabled:opacity-50"
                      >
                        Xóa
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {items.length === 0 && (
        <div className="p-6 text-center text-gray-500">Không có dữ liệu</div>
      )}
    </div>
  );
};
