import React from "react";

type Props = {
  current: number;
  totalPages: number;
  totalItems: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
};

export const Pagination: React.FC<Props> = ({
  current,
  totalPages,
  totalItems,
  setCurrent,
}) => (
  <div className="flex items-center justify-between">
    <div className="text-sm text-gray-600">
      Tổng: {totalItems} • Trang {current}/{totalPages}
    </div>
    <div className="space-x-2">
      <button
        onClick={() => setCurrent((c) => Math.max(c - 1, 1))}
        disabled={current <= 1}
        className="px-3 py-1 rounded border text-sm disabled:opacity-50"
      >
        Trước
      </button>
      <button
        onClick={() => setCurrent((c) => Math.min(c + 1, totalPages))}
        disabled={current >= totalPages}
        className="px-3 py-1 rounded border text-sm disabled:opacity-50"
      >
        Sau
      </button>
    </div>
  </div>
);
