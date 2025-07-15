import mongoose, { Schema, Document } from 'mongoose';

export interface QuestionDocument extends Document {
  questionContent: string;
  answer: string;
  hints?: string[];
  score: number;
  booleanExpression: string;
  outputSymbol: string;
}

const QuestionSchema = new Schema<QuestionDocument>({
  questionContent: { type: String, required: true },
  hints: { type: [String], default: undefined }, // optional array
  score: { type: Number, default: 0 },
  booleanExpression: { type: String, required: true },
  outputSymbol: { type: String, required: true },
});

export const LogictutorQuestionModel = mongoose.model<QuestionDocument>(
  'LogictutorQuestion',
  QuestionSchema,
);
