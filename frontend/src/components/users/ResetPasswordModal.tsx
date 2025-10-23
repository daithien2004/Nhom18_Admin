"use client";

import { useState } from "react";

interface ResetPasswordModalProps {
  id: string;
  onClose: () => void;
  onSubmit: (id: string, newPassword: string) => Promise<void>; // ✅ FIXED
  loading: boolean;
}

export default function ResetPasswordModal({
  id,
  onClose,
  onSubmit,
  loading,
}: ResetPasswordModalProps) {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const isValidLength = pw.length >= 8;
  const isMatch = pw === pw2;
  const isValid = isValidLength && pw2.length > 0 && isMatch;

  const getPasswordStrength = () => {
    if (pw.length < 8) return { level: 0, color: "bg-gray-200", text: "Yếu" };
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pw))
      return { level: 3, color: "bg-green-500", text: "Mạnh" };
    if (/^(?=.*[a-z])(?=.*\d)/.test(pw))
      return { level: 2, color: "bg-yellow-500", text: "Trung bình" };
    return { level: 1, color: "bg-red-500", text: "Yếu" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 max-h-[90vh] overflow-hidden">
        <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-white">Đổi mật khẩu</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
              disabled={loading}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-indigo-100 text-sm">
            Nhập mật khẩu mới cho tài khoản
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className={`w-full px-4 py-4 pr-12 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 ${
                  pw.length === 0
                    ? "border-gray-200"
                    : isValidLength
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
                placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 transition-colors"
              >
                <svg
                  className={`w-5 h-5 ${showPw ? "block" : "hidden"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  className={`w-5 h-5 ${!showPw ? "block" : "hidden"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-24 h-2 rounded-full overflow-hidden ${strength.color}`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${(strength.level / 3) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  {strength.text}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-xs text-gray-500">
                <label
                  className={`flex items-center gap-2 ${
                    isValidLength ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      isValidLength
                        ? "border-green-500 bg-green-500"
                        : "border-red-500"
                    }`}
                  />
                  Tối thiểu 8 ký tự
                </label>
                <label
                  className={`flex items-center gap-2 ${
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pw)
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-colors ${
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pw)
                        ? "border-green-500 bg-green-500"
                        : "border-gray-400"
                    }`}
                  />
                  1 chữ hoa, 1 chữ thường, 1 số
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nhập lại mật khẩu
            </label>
            <div className="relative mt-2">
              <input
                type={showPw2 ? "text" : "password"}
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                className={`w-full px-4 py-4 pr-12 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 ${
                  pw2.length === 0
                    ? "border-gray-200"
                    : isMatch
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
                placeholder="Nhập lại mật khẩu"
              />
              <button
                type="button"
                onClick={() => setShowPw2(!showPw2)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 transition-colors"
              >
                <svg
                  className={`w-5 h-5 ${showPw2 ? "block" : "hidden"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  className={`w-5 h-5 ${!showPw2 ? "block" : "hidden"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              </button>
            </div>
            {pw2.length > 0 && !isMatch && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="15"
                    y1="9"
                    x2="9"
                    y2="15"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="9"
                    y1="9"
                    x2="15"
                    y2="15"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                Mật khẩu không trùng khớp
              </p>
            )}
          </div>
        </div>

        <div className="px-8 pb-8 pt-6 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 flex-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 disabled:opacity-50"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              onClick={() => onSubmit(id, pw)} // ✅ Truyền cả id + pw
              className={`px-6 py-3 flex-1 text-sm font-bold rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-200 disabled:opacity-50 ${
                isValid
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!isValid || loading}
            >
              {loading ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang lưu...
                </div>
              ) : (
                "Xác nhận đổi"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
