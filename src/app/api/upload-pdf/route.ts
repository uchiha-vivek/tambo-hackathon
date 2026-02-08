/**
 * Next.js API Route - Proxy to StudyGenie Backend
 * Solves CORS issues by proxying requests server-side
 */

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_STUDYGENIE_BACKEND_URL || 'https://studygenie-ai.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    console.log('📄 Received file:', file?.name, 'Size:', file?.size, 'bytes');
    console.log('🔄 Forwarding PDF to backend:', `${BACKEND_URL}/api/upload-pdf`);
    console.log('⏰ Timeout set to 5 minutes for AI processing');
    
    // Forward the request to the backend with longer timeout for AI processing
    // Gemini 2.0 Flash analyzing PDF + generating quiz + interview Q&A takes time
    const startTime = Date.now();
    const response = await fetch(`${BACKEND_URL}/api/upload-pdf`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(300000), // 5 minutes for AI processing
    });

    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Backend response status: ${response.status} (took ${elapsedTime}s)`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `Backend returned ${response.status}` }));
      console.error('❌ Backend error:', error);
      return NextResponse.json(
        { error: error.error || 'Failed to process PDF' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ PDF processed successfully');
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('❌ Proxy error:', error);
    
    // Better error messages
    if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
      return NextResponse.json(
        { error: 'Backend is taking too long to respond. It may be cold-starting (Render free tier). Please wait 30 seconds and try again.' },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: `Failed to connect to AI backend: ${error.message || 'Unknown error'}. The backend may be starting up.` },
      { status: 502 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
