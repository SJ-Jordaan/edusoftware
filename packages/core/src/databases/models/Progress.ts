import mongoose from 'mongoose';
import { IQuestionDoc, Question } from './Question';
import { Level } from './Level';

const progressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    levelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Level,
      required: true,
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    totalScore: { type: Number, default: 0 },
    questionsAttempted: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: Question },
        attempts: { type: Number, default: 0 },
        correct: { type: Boolean, default: false },
        timeSpent: { type: Number, default: 0 }, // in seconds
        hintsUsed: { type: Number, default: 0 },
        scoreEarned: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true },
);

export const Progress = mongoose.model('Progress', progressSchema);
interface IQuestionAttempted {
  questionId?: mongoose.Types.ObjectId | null;
  attempts: number;
  correct: boolean;
  timeSpent: number; // in seconds
  hintsUsed: number;
  scoreEarned: number;
  updatedAt?: Date | null;
}

export interface IProgressDocument extends mongoose.Document {
  userId: string;
  levelId: mongoose.Types.ObjectId;
  startedAt?: Date | null;
  completedAt?: Date | null;
  updatedAt?: Date | null;
  totalScore: number;
  questionsAttempted: IQuestionAttempted[];
}

/**
 * Interface for a question attempted, extending to include the populated question document.
 */
interface IQuestionAttemptedPopulated {
  questionId: IQuestionDoc | null; // Populated with a question document or null
  attempts: number;
  correct: boolean;
  timeSpent: number; // in seconds
  hintsUsed: number;
  scoreEarned: number;
  updatedAt?: Date | null;
}

/**
 * Interface for the progress document when questionsAttempted.questionId is populated.
 */
export interface IProgressDocumentPopulated
  extends Omit<IProgressDocument, 'questionsAttempted'> {
  questionsAttempted: IQuestionAttemptedPopulated[];
}
