export interface Badge {
  _id: string;
  name: string;
  description: string;
  icon: string;
  type: BadgeType;
  criteria: BadgeCriteria;
  createdAt: Date;
}

export interface UserBadge {
  userId: string;
  badgeId: string;
  earnedAt: Date;
}

export enum BadgeType {
  ACHIEVEMENT = 'ACHIEVEMENT', // One-time achievements
  MILESTONE = 'MILESTONE', // Progress-based
  MASTERY = 'MASTERY', // Skill-based
}

export interface BadgeCriteria {
  type: BadgeType;
  requirement: {
    metric: string; // e.g., 'questionsCompleted', 'levelsPassed'
    value: number; // Target value to achieve
  };
}
