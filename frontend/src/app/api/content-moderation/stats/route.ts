import { NextRequest, NextResponse } from "next/server";
import { NESTJS_CONTENT_MODERATION_ENDPOINTS } from "@/src/constants/server-endpoints";

// Toan: API route for getting moderation statistics
export async function GET(request: NextRequest) {
  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}${NESTJS_CONTENT_MODERATION_ENDPOINTS.stats}`;

    const response = await fetch(backendUrl, {
      method: "GET",
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
    console.error("Error in moderation stats API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
