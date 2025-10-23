import { NextResponse } from "next/server";
import { getAuthenticatedServerApi } from "@/src/lib/auth-server-api";
import { NESTJS_USERS_ENDPOINTS } from "@/src/constants/server-endpoints";

// GET /api/users -> list users
export async function GET(request: Request) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();

    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const response = await authenticatedApi.get(NESTJS_USERS_ENDPOINTS.list, {
      params,
    });

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

// POST /api/users -> create user
export async function POST(request: Request) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();
    const body = await request.json();

    const response = await authenticatedApi.post(
      NESTJS_USERS_ENDPOINTS.list,
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
      : error.response?.data?.message || "Failed to create user";
    return NextResponse.json({ message }, { status });
  }
}
