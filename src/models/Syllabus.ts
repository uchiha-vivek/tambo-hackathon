/**
 * Syllabus/Course model
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface ISyllabus extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  sourceType: 'pdf' | 'youtube' | 'text';
  sourceUrl?: string;
  content?: string;
  skillMap?: string; // JSON string
  createdAt: Date;
  updatedAt: Date;
}

const SyllabusSchema = new Schema<ISyllabus>(
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
    sourceType: {
      type: String,
      enum: ['pdf', 'youtube', 'text'],
      default: 'pdf',
    },
    sourceUrl: {
      type: String,
    },
    content: {
      type: String,
    },
    skillMap: {
      type: String, // Store as JSON string
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Syllabus || mongoose.model<ISyllabus>('Syllabus', SyllabusSchema);

