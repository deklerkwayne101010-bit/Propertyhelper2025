import { NextRequest, NextResponse } from 'next/server';

// This is a proxy route to the backend admin API
// In a real application, you would implement proper authentication and authorization here

export async function GET(request: NextRequest) {
  try {
    // Get the backend URL from environment variables
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';

    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/admin/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization headers if needed
        ...(request.headers.get('authorization') && {
          authorization: request.headers.get('authorization')!,
        }),
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}