// app/api/reports/stats/summary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { NESTJS_REPORTS_ENDPOINTS } from '@/src/constants/server-endpoints';
import { getAuthenticatedServerApi } from '@/src/lib/auth-server-api';

export async function GET(request: NextRequest) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();

    // Chuyển tiếp request đến NestJS
    const response = await authenticatedApi.get(
      NESTJS_REPORTS_ENDPOINTS.reportsStats
    );

    console.log('✅ BFF received reports stats response from NestJS');

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ BFF Error:', error.message);
    console.error('❌ Error details:', error.response?.data);

    const isAuthError = error.message.includes('Unauthorized');
    const status = isAuthError ? 401 : error.response?.status || 500;
    const message = isAuthError
      ? 'Authentication required.'
      : error.response?.data?.message || 'Failed to fetch reports stats';

    return NextResponse.json({ message }, { status });
  }
}
