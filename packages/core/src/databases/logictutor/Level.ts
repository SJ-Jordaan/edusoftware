import mongoose, { Schema, Document, Types } from 'mongoose';
import { QuestionDocument } from './Question'; // Assuming you created this in the previous step

export interface LevelDocument extends Document {
  levelName: string;
  description: string;
  questionIds?: Types.ObjectId[] | QuestionDocument[];
  updatedAt?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  timeLimit?: number;
}

const LevelSchema = new Schema<LevelDocument>({
  levelName: { type: String, required: true },
  description: { type: String, required: true },
  questionIds: [{ type: Schema.Types.ObjectId, ref: 'Question' }], // Optional populated field
  updatedAt: { type: String }, // Assuming ISO string; if you want timestamps, use Date type instead
  timeLimit: { type: Number },
  difficulty: {
    type: String,
    enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    required: true,
  },
});

export const LogictutorLevelModel = mongoose.model<LevelDocument>(
  'LogictutorLevel',
  LevelSchema,
);
