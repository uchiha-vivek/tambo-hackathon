/**
 * Achievement model
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  description?: string;
  icon?: string;
  unlockedAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

export default mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema);

