import mongoose, { Schema, Document, Types } from 'mongoose';

export interface LogictutorScore {
  userId: string;
  userName: string;
  score: number;
}

export interface LogictutorLeaderboardDocument extends Document {
  levelId: Types.ObjectId;
  levelName: string;
  description: string;
  userScores?: LogictutorScore[];
}

const ScoreSchema = new Schema<LogictutorScore>(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    score: { type: Number, required: true },
  },
  { _id: false }, // Don't create a separate _id for subdocuments
);

const LeaderboardSchema = new Schema<LogictutorLeaderboardDocument>({
  levelId: {
    type: Schema.Types.ObjectId,
    ref: 'LogictutorLevel',
    required: true,
  },
  levelName: { type: String, required: true },
  description: { type: String, required: true },
  userScores: { type: [ScoreSchema], default: [] }, // Optional array of scores
});

export const LogictutorLeaderboardModel =
  mongoose.model<LogictutorLeaderboardDocument>(
    'LogictutorLeaderboard',
    LeaderboardSchema,
  );
