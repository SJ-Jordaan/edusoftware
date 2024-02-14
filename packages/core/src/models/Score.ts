import mongoose from 'mongoose';
import Level from './Level';

const scoreSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  levelId: { type: mongoose.Schema.Types.ObjectId, ref: Level, required: true },
  score: Number,
  createdAt: { type: Date, default: Date.now },
});

const Score = mongoose.model('Score', scoreSchema);

export default Score;
