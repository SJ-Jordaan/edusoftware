import mongoose from 'mongoose';
import { UserBadge } from '../../types';

const userBadgeSchema = new mongoose.Schema<UserBadge>({
  userId: {
    type: String,
    required: true,
  },
  badgeId: {
    type: String,
    ref: 'Badge',
    required: true,
  },
  earnedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// Create compound index for userId and badgeId to ensure uniqueness
userBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

export const UserBadgeModel = mongoose.model<UserBadge>(
  'UserBadge',
  userBadgeSchema,
);
