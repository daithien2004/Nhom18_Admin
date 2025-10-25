// app/api/reports/[id]/actions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { NESTJS_REPORTS_ENDPOINTS } from '@/src/constants/server-endpoints';
import { getAuthenticatedServerApi } from '@/src/lib/auth-server-api';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authenticatedApi = await getAuthenticatedServerApi();

    const body = await request.json();

    // Chuyển tiếp request đến NestJS
    const response = await authenticatedApi.post(
      NESTJS_REPORTS_ENDPOINTS.reportAction(params.id),
      body
    );

    console.log('✅ BFF received report action response from NestJS');

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ BFF Error:', error.message);
    console.error('❌ Error details:', error.response?.data);

    const isAuthError = error.message.includes('Unauthorized');
    const status = isAuthError ? 401 : error.response?.status || 500;
    const message = isAuthError
      ? 'Authentication required.'
      : error.response?.data?.message || 'Failed to handle report action';

    return NextResponse.json({ message }, { status });
  }
}
