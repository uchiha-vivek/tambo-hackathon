/**
 * Study session tracking model
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IStudySession extends Document {
  userId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  duration?: number; // seconds
  focusLevel?: number;
  activitiesCompleted: number;
  xpEarned: number;
  createdAt: Date;
}

const StudySessionSchema = new Schema<IStudySession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    duration: {
      type: Number, // seconds
    },
    focusLevel: {
      type: Number,
      min: 0,
      max: 100,
    },
    activitiesCompleted: {
      type: Number,
      default: 0,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.models.StudySession || mongoose.model<IStudySession>('StudySession', StudySessionSchema);

