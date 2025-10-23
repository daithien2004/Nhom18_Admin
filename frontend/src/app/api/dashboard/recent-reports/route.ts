import { NextResponse } from 'next/server';
import serverApi from '@/src/lib/server-api';
import { NESTJS_DASHBOARD_ENDPOINTS } from '@/src/constants/server-endpoints';
import { getAuthenticatedServerApi } from '@/src/lib/auth-server-api';

export async function GET(request: Request) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();

    const { searchParams } = new URL(request.url);

    const params = {
      limit: searchParams.get('limit'),
      status: searchParams.get('status'),
      sortBy: searchParams.get('sortBy'),
    };

    const response = await authenticatedApi.get(
      NESTJS_DASHBOARD_ENDPOINTS.recentReports,
      { params }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Xử lý lỗi: Đặc biệt là lỗi Unauthorized từ hàm helper
    const isAuthError = error.message.includes('Unauthorized');
    const status = isAuthError ? 401 : error.response?.status || 500;
    const message = isAuthError
      ? 'Authentication required.'
      : error.response?.data?.message || 'Failed to fetch data';

    return NextResponse.json({ message }, { status });
  }
}
