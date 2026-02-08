/**
 * Next.js API Route - Generate Coding Challenge Proxy
 */

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_STUDYGENIE_BACKEND_URL || 'https://studygenie-ai.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/api/generate-coding-challenge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      return NextResponse.json(
        { error: error.error || 'Failed to generate coding challenge' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Coding challenge proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to AI backend' },
      { status: 502 }
    );
  }
}
