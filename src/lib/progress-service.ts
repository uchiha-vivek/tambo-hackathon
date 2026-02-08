/**
 * Progress tracking service
 * Handles user progress persistence and retrieval (MongoDB)
 */

import connectDB from './db';
import Progress, { type IProgress } from '@/models/Progress';
import Topic, { type ITopic } from '@/models/Topic';
import UserProfile, { type IUserProfile } from '@/models/UserProfile';
import StudySession from '@/models/StudySession';
import mongoose from 'mongoose';

export interface ProgressData {
  userId: string;
  syllabusId: string;
  topicId?: string;
  activityType: 'quiz' | 'flashcard' | 'code' | 'interview';
  score?: number;
  timeSpent?: number;
  questionsAnswered?: number;
  correctAnswers?: number;
  xpEarned: number;
  weakAreas?: string[];
}

/**
 * Save progress for a learning activity
 */
export async function saveProgress(data: ProgressData): Promise<IProgress> {
  await connectDB();

  const progress = await Progress.create({
    userId: new mongoose.Types.ObjectId(data.userId),
    syllabusId: new mongoose.Types.ObjectId(data.syllabusId),
    topicId: data.topicId ? new mongoose.Types.ObjectId(data.topicId) : undefined,
    activityType: data.activityType,
    score: data.score,
    timeSpent: data.timeSpent,
    questionsAnswered: data.questionsAnswered,
    correctAnswers: data.correctAnswers,
    xpEarned: data.xpEarned,
    weakAreas: data.weakAreas || [],
  });

  // Update user profile XP
  await updateUserXP(data.userId, data.xpEarned);

  // Update topic status if applicable
  if (data.topicId && data.score !== undefined) {
    await updateTopicStatus(data.topicId, data.score, data.activityType);
  }

  return progress;
}

/**
 * Update user XP and level
 */
async function updateUserXP(userId: string, xpEarned: number): Promise<void> {
  await connectDB();

  const profile = await UserProfile.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!profile) {
    // Create profile if it doesn't exist
    await UserProfile.create({
      userId: new mongoose.Types.ObjectId(userId),
      xp: xpEarned,
    });
    return;
  }

  const newXP = profile.xp + xpEarned;
  let newLevel = profile.level;
  let newTotalXP = profile.totalXP;

  // Check if level up
  const XP_THRESHOLDS = [0, 500, 1200, 2200, 3500, 5000, 6800, 8800, 11000, 13500];
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (newXP >= XP_THRESHOLDS[i]) {
      if (i + 1 > newLevel) {
        newLevel = i + 1;
        newTotalXP = XP_THRESHOLDS[Math.min(i + 1, XP_THRESHOLDS.length - 1)] || newTotalXP * 1.5;
      }
      break;
    }
  }

  await UserProfile.updateOne(
    { userId: new mongoose.Types.ObjectId(userId) },
    {
      $set: {
        xp: newXP,
        level: newLevel,
        totalXP: newTotalXP,
        lastActiveDate: new Date(),
      },
    }
  );
}

/**
 * Update topic status based on performance
 */
async function updateTopicStatus(
  topicId: string,
  score: number,
  activityType: string
): Promise<void> {
  await connectDB();

  const topic = await Topic.findById(topicId);

  if (!topic) return;

  let newStatus = topic.status;

  // Determine status based on score
  if (score >= 0.9) {
    // Excellent performance
    if (topic.status === 'learning' || topic.status === 'weak') {
      newStatus = 'strong';
    } else if (topic.status === 'strong') {
      newStatus = 'mastered';
    }
  } else if (score >= 0.7) {
    // Good performance
    if (topic.status === 'weak') {
      newStatus = 'learning';
    } else if (topic.status === 'learning') {
      newStatus = 'strong';
    }
  } else if (score < 0.5) {
    // Poor performance
    if (topic.status !== 'locked') {
      newStatus = 'weak';
    }
  }

  // Check if prerequisites are met for unlocking
  if (topic.status === 'locked' && topic.prerequisites && topic.prerequisites.length > 0) {
    const prereqTopics = await Topic.find({
      _id: { $in: topic.prerequisites.map((id: string) => new mongoose.Types.ObjectId(id)) },
      syllabusId: topic.syllabusId,
    });

    const allPrereqsMet = prereqTopics.every(
      (p) => p.status === 'mastered' || p.status === 'strong'
    );

    if (allPrereqsMet) {
      newStatus = 'learning';
    }
  }

  if (newStatus !== topic.status) {
    await Topic.updateOne(
      { _id: new mongoose.Types.ObjectId(topicId) },
      { $set: { status: newStatus } }
    );
  }
}

/**
 * Get user progress for a syllabus
 */
export async function getUserProgress(
  userId: string,
  syllabusId: string
): Promise<IProgress[]> {
  await connectDB();

  return Progress.find({
    userId: new mongoose.Types.ObjectId(userId),
    syllabusId: new mongoose.Types.ObjectId(syllabusId),
  })
    .sort({ createdAt: -1 })
    .exec();
}

/**
 * Get user statistics
 */
export async function getUserStats(userId: string) {
  await connectDB();

  const profile = await UserProfile.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  });

  const totalProgress = await Progress.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
  });

  const masteredTopics = await Topic.countDocuments({
    syllabusId: { $exists: true }, // Topics belong to user's syllabi
    status: 'mastered',
  });

  const totalSessions = await StudySession.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
  });

  return {
    profile,
    totalProgress,
    masteredTopics,
    totalSessions,
  };
}

/**
 * Get weak areas for a user
 */
export async function getWeakAreas(userId: string, syllabusId?: string): Promise<string[]> {
  await connectDB();

  const query: any = {
    userId: new mongoose.Types.ObjectId(userId),
    weakAreas: { $exists: true, $ne: [] },
  };

  if (syllabusId) {
    query.syllabusId = new mongoose.Types.ObjectId(syllabusId);
  }

  const progress = await Progress.find(query)
    .sort({ createdAt: -1 })
    .limit(50)
    .exec();

  const weakAreasSet = new Set<string>();
  
  for (const p of progress) {
    if (p.weakAreas && p.weakAreas.length > 0) {
      p.weakAreas.forEach((area: string) => weakAreasSet.add(area));
    }
  }

  return Array.from(weakAreasSet);
}

/**
 * Start a study session
 */
export async function startStudySession(userId: string): Promise<string> {
  await connectDB();

  const session = await StudySession.create({
    userId: new mongoose.Types.ObjectId(userId),
    startTime: new Date(),
  });

  return session._id.toString();
}

/**
 * End a study session
 */
export async function endStudySession(
  sessionId: string,
  xpEarned: number,
  activitiesCompleted: number,
  focusLevel?: number
): Promise<void> {
  await connectDB();

  const session = await StudySession.findById(sessionId);

  if (!session) return;

  const endTime = new Date();
  const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000);

  await StudySession.updateOne(
    { _id: new mongoose.Types.ObjectId(sessionId) },
    {
      $set: {
        endTime,
        duration,
        xpEarned,
        activitiesCompleted,
        focusLevel,
      },
    }
  );
}
