import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value; // hoặc tên cookie lưu JWT của bạn

  // Nếu không có token → redirect về trang login
  if (!token && req.nextUrl.pathname.startsWith('/app')) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Áp dụng middleware cho các route cần bảo vệ
export const config = {
  matcher: ['/app/:path*'], // chỉ chạy với các trang con của /app
};
