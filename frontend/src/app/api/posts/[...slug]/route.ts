import { NextResponse } from "next/server";
import { getAuthenticatedServerApi } from "@/src/lib/auth-server-api";
import { NESTJS_POSTS_ENDPOINTS } from "@/src/constants/server-endpoints";

// Xây dựng path và method dựa trên slug động
function buildPath(slug: string[] | undefined): {
  method: "GET" | "PATCH";
  path: string;
} {
  if (!slug || slug.length === 0) {
    return { method: "GET", path: NESTJS_POSTS_ENDPOINTS.list };
  }

  const [id, action] = slug;

  if (!id) return { method: "GET", path: NESTJS_POSTS_ENDPOINTS.list };

  switch (action) {
    case undefined:
      return { method: "GET", path: NESTJS_POSTS_ENDPOINTS.detail(id) };
    case "hide":
      return { method: "PATCH", path: NESTJS_POSTS_ENDPOINTS.hide(id) };
    case "unhide":
      return { method: "PATCH", path: NESTJS_POSTS_ENDPOINTS.unhide(id) };
    case "delete":
      return { method: "PATCH", path: NESTJS_POSTS_ENDPOINTS.delete(id) };
    default:
      return { method: "GET", path: NESTJS_POSTS_ENDPOINTS.detail(id) };
  }
}

// GET: lấy danh sách hoặc chi tiết bài viết
export async function GET(
  request: Request,
  { params }: { params: { slug?: string[] } }
) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const { path } = buildPath(params.slug);
    const response = await authenticatedApi.get(path, { params: query });
    return NextResponse.json(response.data);
  } catch (error: any) {
    const isAuthError =
      typeof error?.message === "string" &&
      error.message.includes("Unauthorized");
    const status = isAuthError ? 401 : error.response?.status || 500;
    const message = isAuthError
      ? "Authentication required."
      : error.response?.data?.message || "Failed to fetch post";
    return NextResponse.json({ message }, { status });
  }
}

// PATCH: ẩn/bỏ ẩn/xóa bài viết
export async function PATCH(
  request: Request,
  { params }: { params: { slug?: string[] } }
) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();
    const { path } = buildPath(params.slug);
    const body = await request.json().catch(() => ({}));

    const response = await authenticatedApi.patch(path, body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const isAuthError =
      typeof error?.message === "string" &&
      error.message.includes("Unauthorized");
    const status = isAuthError ? 401 : error.response?.status || 500;
    const message = isAuthError
      ? "Authentication required."
      : error.response?.data?.message || "Failed to update post";
    return NextResponse.json({ message }, { status });
  }
}
