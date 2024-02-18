import mongoose from 'mongoose';

export interface UserProgress {
  _id: string;
  userId: string;
  levelId: string;
  totalScore: number;
  startedAt: string; // Date string in ISO format
  questionsAttempted: Array<{
    questionId: string;
    attempts: number;
    correct: boolean;
    timeSpent: number;
    hintsUsed: number;
    scoreEarned: number;
  }>;
  createdAt: string; // Date string in ISO format
  updatedAt: string; // Date string in ISO format
  __v: number;
  completedAt: string | null; // Date string in ISO format or null
}

interface IQuestionAttempted {
  questionId?: mongoose.Types.ObjectId | null;
  attempts: number;
  correct: boolean;
  timeSpent: number; // in seconds
  hintsUsed: number;
  scoreEarned: number;
}

export interface IProgressDocument extends mongoose.Document {
  userId: string;
  levelId: mongoose.Types.ObjectId;
  startedAt?: Date | null;
  completedAt?: Date | null;
  totalScore: number;
  questionsAttempted: IQuestionAttempted[];
}
