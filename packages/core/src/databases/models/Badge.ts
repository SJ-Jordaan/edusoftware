import mongoose from 'mongoose';
import { Badge, BadgeType } from '../../types';

const badgeSchema = new mongoose.Schema<Badge>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  type: {
    type: String,
    enum: Object.values(BadgeType),
    required: true,
  },
  criteria: {
    type: {
      type: String,
      enum: Object.values(BadgeType),
      required: true,
    },
    requirement: {
      metric: { type: String, required: true },
      value: { type: Number, required: true },
    },
  },
  createdAt: { type: Date, default: Date.now },
});

export const BadgeModel = mongoose.model<Badge>('Badge', badgeSchema);
