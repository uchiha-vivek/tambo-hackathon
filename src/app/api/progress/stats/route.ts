/**
 * Get user statistics API endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserStats, getWeakAreas } from '@/lib/progress-service';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const syllabusId = searchParams.get('syllabusId');

    const stats = await getUserStats(user.id);
    const weakAreas = await getWeakAreas(user.id, syllabusId || undefined);

    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        weakAreas,
      },
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get statistics' },
      { status: 500 }
    );
  }
}

