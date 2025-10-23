import { NextResponse } from "next/server";
import { getAuthenticatedServerApi } from "@/src/lib/auth-server-api";
import { NESTJS_USERS_ENDPOINTS } from "@/src/constants/server-endpoints";

function buildPath(slug: string[] | undefined): {
  method: "GET" | "PATCH" | "POST";
  path: string;
} {
  if (!slug || slug.length === 0) {
    // This route is only for dynamic paths; root handled by ../route.ts
    return { method: "GET", path: NESTJS_USERS_ENDPOINTS.list };
  }
  const [id, action] = slug;
  if (!id) return { method: "GET", path: NESTJS_USERS_ENDPOINTS.list };

  switch (action) {
    case undefined:
      return { method: "GET", path: NESTJS_USERS_ENDPOINTS.detail(id) };
    case "ban":
      return { method: "PATCH", path: NESTJS_USERS_ENDPOINTS.ban(id) };
    case "unban":
      return { method: "PATCH", path: NESTJS_USERS_ENDPOINTS.unban(id) };
    case "verify":
      return { method: "PATCH", path: NESTJS_USERS_ENDPOINTS.verify(id) };
    case "unverify":
      return { method: "PATCH", path: NESTJS_USERS_ENDPOINTS.unverify(id) };
    case "reset-password":
      return { method: "POST", path: NESTJS_USERS_ENDPOINTS.resetPassword(id) };
    default:
      return { method: "GET", path: NESTJS_USERS_ENDPOINTS.detail(id) };
  }
}

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
      : error.response?.data?.message || "Failed to fetch user";
    return NextResponse.json({ message }, { status });
  }
}

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
      : error.response?.data?.message || "Failed to update user";
    return NextResponse.json({ message }, { status });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { slug?: string[] } }
) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();
    const { path } = buildPath(params.slug);
    const body = await request.json().catch(() => ({}));

    const response = await authenticatedServerApiPost(
      authenticatedApi,
      path,
      body
    );
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

async function authenticatedServerApiPost(
  authenticatedApi: any,
  path: string,
  body: any
) {
  // Special-case validation for reset-password
  if (path.endsWith("/reset-password")) {
    const newPassword = body?.newPassword;
    if (!newPassword || newPassword.length < 6) {
      throw {
        response: {
          status: 400,
          data: { message: "Password must be at least 6 characters" },
        },
      };
    }
  }
  return authenticatedApi.post(path, body);
}
