// app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { NESTJS_REPORTS_ENDPOINTS } from '@/src/constants/server-endpoints';
import { getAuthenticatedServerApi } from '@/src/lib/auth-server-api';

export async function GET(request: NextRequest) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();

    const { searchParams } = request.nextUrl;

    const params = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      status: searchParams.get('status') || undefined,
      reportType: searchParams.get('reportType') || undefined,
      reason: searchParams.get('reason') || undefined,
      search: searchParams.get('search') || undefined,
    };

    // Remove undefined values
    Object.keys(params).forEach((key) => {
      if (params[key as keyof typeof params] === undefined) {
        delete params[key as keyof typeof params];
      }
    });

    // Chuyển tiếp request đến NestJS
    const response = await authenticatedApi.get(
      NESTJS_REPORTS_ENDPOINTS.reports,
      { params }
    );

    console.log('✅ BFF received reports response from NestJS');

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ BFF Error:', error.message);
    console.error('❌ Error details:', error.response?.data);

    const isAuthError = error.message.includes('Unauthorized');
    const status = isAuthError ? 401 : error.response?.status || 500;
    const message = isAuthError
      ? 'Authentication required.'
      : error.response?.data?.message || 'Failed to fetch reports';

    return NextResponse.json({ message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();

    const body = await request.json();

    // Chuyển tiếp request đến NestJS
    const response = await authenticatedApi.post(
      NESTJS_REPORTS_ENDPOINTS.reports,
      body
    );

    console.log('✅ BFF received create report response from NestJS');

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ BFF Error:', error.message);
    console.error('❌ Error details:', error.response?.data);

    const isAuthError = error.message.includes('Unauthorized');
    const status = isAuthError ? 401 : error.response?.status || 500;
    const message = isAuthError
      ? 'Authentication required.'
      : error.response?.data?.message || 'Failed to create report';

    return NextResponse.json({ message }, { status });
  }
}
