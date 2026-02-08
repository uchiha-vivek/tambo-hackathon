/**
 * YouTube link parsing API endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { processYouTubeLink, segmentTranscript } from '@/services/youtube-service';
import connectDB from '@/lib/db';
import Syllabus from '@/models/Syllabus';
import { requireAuth } from '@/lib/auth';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { url, title } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    // Process YouTube link
    const videoInfo = await processYouTubeLink(url);

    // Segment transcript
    const segments = segmentTranscript(videoInfo.transcript);

    await connectDB();

    // Create syllabus entry
    const syllabus = await Syllabus.create({
      userId: new mongoose.Types.ObjectId(user.id),
      title: title || `YouTube Video: ${videoInfo.videoId}`,
      sourceType: 'youtube',
      sourceUrl: url,
      content: videoInfo.transcript,
    });

    return NextResponse.json({
      success: true,
      syllabus: {
        id: syllabus._id.toString(),
        title: syllabus.title,
        sourceType: syllabus.sourceType,
        videoId: videoInfo.videoId,
        transcriptLength: videoInfo.transcript.length,
        segments: segments.length,
      },
    });
  } catch (error: any) {
    console.error('YouTube parsing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse YouTube link' },
      { status: 500 }
    );
  }
}

