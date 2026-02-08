/**
 * User Profile model with game stats
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId;
  level: number;
  xp: number;
  totalXP: number;
  health: number;
  focus: number;
  streak: number;
  lastActiveDate: Date;
  interviewReadiness: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    level: {
      type: Number,
      default: 1,
    },
    xp: {
      type: Number,
      default: 0,
    },
    totalXP: {
      type: Number,
      default: 500,
    },
    health: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    focus: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
    interviewReadiness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);

