/**
 * Daily Quest model
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyQuest extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  type: 'quiz' | 'code' | 'flashcard' | 'focus';
  target: number;
  progress: number;
  xpReward: number;
  completed: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DailyQuestSchema = new Schema<IDailyQuest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ['quiz', 'code', 'flashcard', 'focus'],
      required: true,
    },
    target: {
      type: Number,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    xpReward: {
      type: Number,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint on userId, date, and title
DailyQuestSchema.index({ userId: 1, date: 1, title: 1 }, { unique: true });

export default mongoose.models.DailyQuest || mongoose.model<IDailyQuest>('DailyQuest', DailyQuestSchema);

