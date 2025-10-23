import { NextResponse } from "next/server";
import { getAuthenticatedServerApi } from "@/src/lib/auth-server-api";

// Khai báo endpoint của NestJS (port 5000)
const BASE_URL = "http://localhost:5000/users";

// Xây dựng đường dẫn động dựa trên slug (ví dụ: /users/:id/ban)
function buildTargetPath(slug: string[] | undefined): string {
  if (!slug || slug.length === 0) return BASE_URL;

  const [id, action] = slug;
  if (!id) return BASE_URL;

  switch (action) {
    case undefined:
      return `${BASE_URL}/${id}`;
    case "ban":
      return `${BASE_URL}/${id}/ban`;
    case "unban":
      return `${BASE_URL}/${id}/unban`;
    case "verify":
      return `${BASE_URL}/${id}/verify`;
    case "unverify":
      return `${BASE_URL}/${id}/unverify`;
    case "reset-password":
      return `${BASE_URL}/${id}/reset-password`;
    default:
      return BASE_URL;
  }
}

// GET: Lấy danh sách hoặc chi tiết user
export async function GET(
  request: Request,
  { params }: { params: { slug?: string[] } }
) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();
    const { searchParams } = new URL(request.url);

    const query: Record<string, any> = {};
    searchParams.forEach((v, k) => (query[k] = v));

    const path = buildTargetPath(params.slug);
    const response = await authenticatedApi.get(path, { params: query });

    // chỉ trả ra phần `data` thật bên trong
    return NextResponse.json(response.data);
  } catch (error: any) {
    const isAuthError =
      typeof error?.message === "string" &&
      error.message.includes("Unauthorized");
    const status = isAuthError ? 401 : error.response?.status || 500;
    const message = isAuthError
      ? "Authentication required."
      : error.response?.data?.message || "Failed to fetch users";
    return NextResponse.json({ message }, { status });
  }
}

// PATCH: Cập nhật, ban/unban, verify/unverify
export async function PATCH(
  request: Request,
  { params }: { params: { slug?: string[] } }
) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();
    const path = buildTargetPath(params.slug);
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
      : error.response?.data?.message || "Failed to update user";
    return NextResponse.json({ message }, { status });
  }
}

// POST: Tạo user mới hoặc reset mật khẩu
export async function POST(
  request: Request,
  { params }: { params: { slug?: string[] } }
) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();
    const path = buildTargetPath(params.slug);
    const body = await request.json().catch(() => ({}));

    const response = await authenticatedApi.post(path, body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const isAuthError =
      typeof error?.message === "string" &&
      error.message.includes("Unauthorized");
    const status = isAuthError ? 401 : error.response?.status || 500;
    const message = isAuthError
      ? "Authentication required."
      : error.response?.data?.message || "Failed to execute action";
    return NextResponse.json({ message }, { status });
  }
}
