import { NextResponse } from "next/server";
import { getAuthenticatedServerApi } from "@/src/lib/auth-server-api";
import { NESTJS_COMMENTS_ENDPOINTS } from "@/src/constants/server-endpoints";

// PATCH /api/comments/[id]/hide -> hide comment
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();

    const response = await authenticatedApi.patch(
      NESTJS_COMMENTS_ENDPOINTS.hide(params.id)
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    const isAuthError =
      typeof error?.message === "string" &&
      error.message.includes("Unauthorized");
    const status = isAuthError ? 401 : error.response?.status || 500;
    const message = isAuthError
      ? "Authentication required."
      : error.response?.data?.message || "Failed to hide comment";

    return NextResponse.json({ message }, { status });
  }
}
