import { NextRequest, NextResponse } from "next/server";
import { NESTJS_CONTENT_MODERATION_ENDPOINTS } from "@/src/constants/server-endpoints";

// Toan: API route for searching inappropriate posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}${NESTJS_CONTENT_MODERATION_ENDPOINTS.search}?${queryString}`;

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
    console.error("Error in content moderation search API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
