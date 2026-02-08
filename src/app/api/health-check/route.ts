import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_STUDYGENIE_BACKEND_URL || 'https://studygenie-ai.onrender.com';

export async function GET() {
  try {
    console.log('[Health Check] Pinging backend:', BACKEND_URL);
    
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(10000), // 10 second timeout for health check
    });

    if (!response.ok) {
      console.log('[Health Check] Backend not healthy:', response.status);
      return NextResponse.json(
        { status: 'cold', message: 'Backend is starting up' },
        { status: 503 }
      );
    }

    const data = await response.json();
    console.log('[Health Check] Backend is healthy:', data);
    
    return NextResponse.json({
      status: 'ready',
      backend: data
    });

  } catch (error: any) {
    console.error('[Health Check] Error:', error.message);
    
    if (error.name === 'TimeoutError') {
      return NextResponse.json(
        { 
          status: 'cold',
          message: 'Backend is cold-starting (Render free tier). Please wait 30 seconds.'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        status: 'error',
        message: 'Unable to reach backend',
        error: error.message
      },
      { status: 503 }
    );
  }
}
