// app/api/reports/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { NESTJS_REPORTS_ENDPOINTS } from '@/src/constants/server-endpoints';
import { getAuthenticatedServerApi } from '@/src/lib/auth-server-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();

    // Chuyển tiếp request đến NestJS
    const response = await authenticatedApi.get(
      NESTJS_REPORTS_ENDPOINTS.reportById(params.id)
    );

    console.log('✅ BFF received report by id response from NestJS');

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ BFF Error:', error.message);
    console.error('❌ Error details:', error.response?.data);

    const isAuthError = error.message.includes('Unauthorized');
    const status = isAuthError ? 401 : error.response?.status || 500;
    const message = isAuthError
      ? 'Authentication required.'
      : error.response?.data?.message || 'Failed to fetch report';

    return NextResponse.json({ message }, { status });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();

    const body = await request.json();

    // Chuyển tiếp request đến NestJS
    const response = await authenticatedApi.put(
      NESTJS_REPORTS_ENDPOINTS.reportById(params.id),
      body
    );

    console.log('✅ BFF received update report response from NestJS');

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ BFF Error:', error.message);
    console.error('❌ Error details:', error.response?.data);

    const isAuthError = error.message.includes('Unauthorized');
    const status = isAuthError ? 401 : error.response?.status || 500;
    const message = isAuthError
      ? 'Authentication required.'
      : error.response?.data?.message || 'Failed to update report';

    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();

    // Chuyển tiếp request đến NestJS
    const response = await authenticatedApi.delete(
      NESTJS_REPORTS_ENDPOINTS.reportById(params.id)
    );

    console.log('✅ BFF received delete report response from NestJS');

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ BFF Error:', error.message);
    console.error('❌ Error details:', error.response?.data);

    const isAuthError = error.message.includes('Unauthorized');
    const status = isAuthError ? 401 : error.response?.status || 500;
    const message = isAuthError
      ? 'Authentication required.'
      : error.response?.data?.message || 'Failed to delete report';

    return NextResponse.json({ message }, { status });
  }
}
