import { PopulatedQuestion } from './Question';

export interface LambdaResponse<T> {
  statusCode: number;
  body: T;
  headers?: { [header: string]: string };
}

export interface AnswerEvaluation {
  isCorrect: boolean;
  scoreEarned?: number;
  isCompleted: boolean;
  message: string;
}

export interface GetLevelProgressResponse {
  question?: PopulatedQuestion;
  timeRemaining?: number;
  isCompleted: boolean;
  isPractice: boolean;
  memo?: string;
}
