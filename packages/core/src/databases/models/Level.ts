import mongoose, { Schema } from 'mongoose';
import { Question } from './Question';

const levelSchema = new Schema(
  {
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

export const Level = mongoose.model('Level', levelSchema);
