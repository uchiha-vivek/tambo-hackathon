/**
 * YouTube video parsing and transcript extraction
 */

import { YoutubeTranscript } from 'youtube-transcript';

export interface YouTubeVideoInfo {
  videoId: string;
  title?: string;
  description?: string;
  duration?: number;
  transcript: string;
}

/**
 * Extract video ID from YouTube URL
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Fetch transcript from YouTube video
 */
export async function fetchYouTubeTranscript(
  videoId: string
): Promise<string> {
  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    
    // Combine all transcript items into a single text
    const transcript = transcriptItems
      .map((item) => item.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    return transcript;
  } catch (error) {
    console.error('Error fetching YouTube transcript:', error);
    throw new Error(`Failed to fetch transcript for video ${videoId}`);
  }
}

/**
 * Process YouTube link and extract content
 */
export async function processYouTubeLink(
  url: string
): Promise<YouTubeVideoInfo> {
  const videoId = extractVideoId(url);

  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  const transcript = await fetchYouTubeTranscript(videoId);

  return {
    videoId,
    transcript,
  };
}

/**
 * Segment transcript into topics/chapters
 * Uses simple heuristics to identify topic breaks
 */
export function segmentTranscript(
  transcript: string,
  maxSegmentLength: number = 2000
): string[] {
  const sentences = transcript.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const segments: string[] = [];
  let currentSegment = '';

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    
    // Check if adding this sentence would exceed max length
    if (currentSegment.length + trimmed.length > maxSegmentLength && currentSegment.length > 0) {
      segments.push(currentSegment.trim());
      currentSegment = trimmed;
    } else {
      currentSegment += (currentSegment ? ' ' : '') + trimmed;
    }
  }

  // Add remaining segment
  if (currentSegment.trim().length > 0) {
    segments.push(currentSegment.trim());
  }

  return segments;
}

