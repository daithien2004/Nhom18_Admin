import { NextRequest, NextResponse } from "next/server";
import { NESTJS_CONTENT_MODERATION_ENDPOINTS } from "@/src/constants/server-endpoints";

// Toan: API route for deleting inappropriate posts
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backendUrl = `${
      process.env.NEXT_PUBLIC_API_URL
    }${NESTJS_CONTENT_MODERATION_ENDPOINTS.delete(params.id)}`;

    const response = await fetch(backendUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("Authorization") || "",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in delete post API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
