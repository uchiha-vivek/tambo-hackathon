/**
 * Flashcard model with spaced repetition
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IFlashcard extends Document {
  userId: mongoose.Types.ObjectId;
  front: string;
  back: string;
  topic?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  easeFactor: number; // SM-2 algorithm
  interval: number; // days
  repetitions: number;
  lastReview?: Date;
  nextReview: Date;
  mastered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FlashcardSchema = new Schema<IFlashcard>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    front: {
      type: String,
      required: true,
    },
    back: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    easeFactor: {
      type: Number,
      default: 2.5,
    },
    interval: {
      type: Number,
      default: 1, // days
    },
    repetitions: {
      type: Number,
      default: 0,
    },
    lastReview: {
      type: Date,
    },
    nextReview: {
      type: Date,
      default: Date.now,
    },
    mastered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Flashcard || mongoose.model<IFlashcard>('Flashcard', FlashcardSchema);

