// app/api/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { NESTJS_DASHBOARD_ENDPOINTS } from '@/src/constants/server-endpoints';
import { getAuthenticatedServerApi } from '@/src/lib/auth-server-api';

export async function GET(request: NextRequest) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();

    const { searchParams } = request.nextUrl;

    const params = {
      period: searchParams.get('period') || '24h',
    };

    // Chuyển tiếp request đến NestJS
    const response = await authenticatedApi.get(
      NESTJS_DASHBOARD_ENDPOINTS.stats,
      { params }
    );

    console.log('✅ BFF received response from NestJS');

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ BFF Error:', error.message);
    console.error('❌ Error details:', error.response?.data);

    const isAuthError = error.message.includes('Unauthorized');
    const status = isAuthError ? 401 : error.response?.status || 500;
    const message = isAuthError
      ? 'Authentication required.'
      : error.response?.data?.message || 'Failed to fetch data';

    return NextResponse.json({ message }, { status });
  }
}
