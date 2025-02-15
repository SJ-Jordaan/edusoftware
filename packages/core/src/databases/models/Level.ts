import mongoose from 'mongoose';
import { Question, IQuestionDoc } from './Question';

interface ILevelDoc extends mongoose.Document {
  levelName: string;
  description: string;
  questionIds: mongoose.Types.ObjectId[];
  startDate: Date;
  endDate: Date;
}

const levelSchema = new mongoose.Schema(
  {
    organisation: {
      type: String,
      required: true,
    },
    levelName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    questionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Question,
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export interface IPopulatedLevelDoc extends Omit<ILevelDoc, 'questionIds'> {
  questionIds: IQuestionDoc[];
}

export const Level = mongoose.model<ILevelDoc>('Level', levelSchema);
