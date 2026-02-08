/**
 * Topic model (from skill map)
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface ITopic extends Document {
  syllabusId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'locked' | 'weak' | 'learning' | 'strong' | 'boss' | 'mastered';
  estimatedHours?: number;
  prerequisites?: string[]; // Array of topic IDs
  subtopics?: string[]; // Array of subtopic names
  createdAt: Date;
  updatedAt: Date;
}

const TopicSchema = new Schema<ITopic>(
  {
    syllabusId: {
      type: Schema.Types.ObjectId,
      ref: 'Syllabus',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['locked', 'weak', 'learning', 'strong', 'boss', 'mastered'],
      default: 'locked',
    },
    estimatedHours: {
      type: Number,
    },
    prerequisites: {
      type: [String],
      default: [],
    },
    subtopics: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Topic || mongoose.model<ITopic>('Topic', TopicSchema);

