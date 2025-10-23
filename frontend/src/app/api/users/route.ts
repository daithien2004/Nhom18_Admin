import { NextResponse } from "next/server";
import { getAuthenticatedServerApi } from "@/src/lib/auth-server-api";
import { NESTJS_USERS_ENDPOINTS } from "@/src/constants/server-endpoints";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();
    const { id } = params;

    const response = await authenticatedApi.get(
      NESTJS_USERS_ENDPOINTS.detail(id)
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    const isAuthError = error.message.includes("Unauthorized");
    const status = isAuthError ? 401 : error.response?.status || 500;
    const message = isAuthError
      ? "Authentication required."
      : error.response?.data?.message || "Failed to fetch user";

    return NextResponse.json({ message }, { status });
  }
}

// POST cho tất cả actions: ban/unban/verify/unverify/reset-password
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();
    const { id } = params;
    const body = await request.json();

    const { action, newPassword } = body;

    switch (action) {
      case "ban":
        await authenticatedApi.post(NESTJS_USERS_ENDPOINTS.ban(id));
        break;
      case "unban":
        await authenticatedApi.post(NESTJS_USERS_ENDPOINTS.unban(id));
        break;
      case "verify":
        await authenticatedApi.post(NESTJS_USERS_ENDPOINTS.verify(id));
        break;
      case "unverify":
        await authenticatedApi.post(NESTJS_USERS_ENDPOINTS.unverify(id));
        break;
      case "resetPassword":
        if (!newPassword || newPassword.length < 6) {
          return NextResponse.json(
            { message: "Password must be at least 6 characters" },
            { status: 400 }
          );
        }
        await authenticatedApi.post(NESTJS_USERS_ENDPOINTS.resetPassword(id), {
          newPassword,
        });
        break;
      default:
        return NextResponse.json(
          { message: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Action failed";

    return NextResponse.json({ message }, { status });
  }
}
