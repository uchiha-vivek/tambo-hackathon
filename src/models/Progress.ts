/**
 * Progress tracking model
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  syllabusId: mongoose.Types.ObjectId;
  topicId?: mongoose.Types.ObjectId;
  activityType: 'quiz' | 'flashcard' | 'code' | 'interview';
  score?: number;
  timeSpent?: number; // seconds
  questionsAnswered?: number;
  correctAnswers?: number;
  xpEarned: number;
  weakAreas?: string[]; // Array of topic names
  createdAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    syllabusId: {
      type: Schema.Types.ObjectId,
      ref: 'Syllabus',
      required: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
    },
    activityType: {
      type: String,
      enum: ['quiz', 'flashcard', 'code', 'interview'],
      required: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 1,
    },
    timeSpent: {
      type: Number, // seconds
    },
    questionsAnswered: {
      type: Number,
    },
    correctAnswers: {
      type: Number,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    weakAreas: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);

