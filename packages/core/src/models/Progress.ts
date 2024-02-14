import mongoose from 'mongoose';
import Question from './Question';
import Level from './Level';

const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  levelId: { type: mongoose.Schema.Types.ObjectId, ref: Level, required: true },
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
    }
  ],
}, { timestamps: true });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
