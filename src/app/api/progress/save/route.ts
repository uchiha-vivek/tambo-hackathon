/**
 * Save progress API endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { saveProgress } from '@/lib/progress-service';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const progress = await saveProgress({
      userId: user.id,
      syllabusId: body.syllabusId,
      topicId: body.topicId,
      activityType: body.activityType,
      score: body.score,
      timeSpent: body.timeSpent,
      questionsAnswered: body.questionsAnswered,
      correctAnswers: body.correctAnswers,
      xpEarned: body.xpEarned || 0,
      weakAreas: body.weakAreas,
    });

    return NextResponse.json({
      success: true,
      progress: {
        id: progress.id,
        xpEarned: progress.xpEarned,
      },
    });
  } catch (error: any) {
    console.error('Save progress error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save progress' },
      { status: 500 }
    );
  }
}

