import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { ErrorResponseDto, ResponseDto } from "../types/response";

/**
 * ✅ Cấu hình Axios client dành cho frontend
 * Chỉ gọi các route API nội bộ của Next.js (/api)
 * => BFF (Backend For Frontend)
 */
const clientApi = axios.create({
  baseURL: "/api", // Gọi API nội bộ Next.js
  withCredentials: true, // Tự động gửi cookie nếu có
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor cho request (nếu cần thêm token hoặc debug)
clientApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ✅ Hàm base query dùng cho Redux Toolkit Query
 * Giúp bạn gọi API bằng Axios thay vì fetch mặc định
 */
export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      body?: AxiosRequestConfig["data"];
      headers?: AxiosRequestConfig["headers"];
      params?: AxiosRequestConfig["params"]; // ✅ thêm param hỗ trợ query string
    },
    unknown,
    { status: number; data: ErrorResponseDto }
  > =>
  async ({ url, method = "GET", body, headers, params }) => {
    try {
      const result = await clientApi({
        url,
        method,
        data: body,
        headers,
        params,
      });

      const responseData = result.data as ResponseDto<unknown>;

      // Nếu API trả về success = false
      if (!responseData.success) {
        return {
          error: {
            status: responseData.statusCode,
            data: responseData as any,
          },
        };
      }

      // ✅ Trả dữ liệu đúng format RTK Query yêu cầu
      return { data: responseData.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<ErrorResponseDto>;

      return {
        error: {
          status: err.response?.status || 500,
          data: err.response?.data || {
            success: false,
            statusCode: err.response?.status || 500,
            message: err.message,
            error: "Client Error",
            timestamp: new Date().toISOString(),
            path: url,
          },
        },
      };
    }
  };

export default clientApi;
