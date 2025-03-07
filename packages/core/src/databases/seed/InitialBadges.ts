import { Badge, BadgeType } from '../../types';

export const initialBadges: Partial<Badge>[] = [
  {
    name: 'Welcome Aboard',
    description: 'Logged in for the first time',
    icon: '/badges/welcome.svg',
    type: BadgeType.ACHIEVEMENT,
    criteria: {
      type: BadgeType.ACHIEVEMENT,
      requirement: {
        metric: 'loginCount',
        value: 1,
      },
    },
  },
];

export const ACHIEVEMENT_BADGES: Partial<Badge>[] = [
  {
    name: 'Level Master',
    description: 'Complete all questions in a single level with 100% accuracy',
    icon: '🏆',
    type: BadgeType.ACHIEVEMENT,
    criteria: {
      type: BadgeType.ACHIEVEMENT,
      requirement: {
        metric: 'PERFECT_LEVEL_COMPLETION',
        value: 1,
      },
    },
  },
  {
    name: 'Practice Makes Perfect',
    description: 'Complete 5 practice levels',
    icon: '🎯',
    type: BadgeType.ACHIEVEMENT,
    criteria: {
      type: BadgeType.ACHIEVEMENT,
      requirement: {
        metric: 'PRACTICE_LEVELS_COMPLETED',
        value: 5,
      },
    },
  },
  {
    name: 'Competition Ready',
    description: 'Participate in 3 non-practice levels',
    icon: '🎮',
    type: BadgeType.ACHIEVEMENT,
    criteria: {
      type: BadgeType.ACHIEVEMENT,
      requirement: {
        metric: 'CHALLENGE_LEVELS_ATTEMPTED',
        value: 3,
      },
    },
  },
  {
    name: 'Speed Demon',
    description: 'Complete a level in under 5 minutes',
    icon: '⚡',
    type: BadgeType.ACHIEVEMENT,
    criteria: {
      type: BadgeType.ACHIEVEMENT,
      requirement: {
        metric: 'LEVEL_COMPLETION_TIME',
        value: 300, // seconds
      },
    },
  },
  {
    name: 'Automaton Expert',
    description: 'Successfully create 10 correct automata',
    icon: '🤖',
    type: BadgeType.ACHIEVEMENT,
    criteria: {
      type: BadgeType.ACHIEVEMENT,
      requirement: {
        metric: 'CORRECT_AUTOMATA_COUNT',
        value: 10,
      },
    },
  },
  {
    name: 'Regex Wizard',
    description: 'Create 10 correct regular expressions',
    icon: '✨',
    type: BadgeType.ACHIEVEMENT,
    criteria: {
      type: BadgeType.ACHIEVEMENT,
      requirement: {
        metric: 'CORRECT_REGEX_COUNT',
        value: 10,
      },
    },
  },
  {
    name: 'Perfect Streak',
    description: 'Answer 5 questions correctly in a row',
    icon: '🔥',
    type: BadgeType.ACHIEVEMENT,
    criteria: {
      type: BadgeType.ACHIEVEMENT,
      requirement: {
        metric: 'CORRECT_ANSWER_STREAK',
        value: 5,
      },
    },
  },
  {
    name: 'Early Bird',
    description: 'Complete a level within the first 24 hours of its release',
    icon: '🌅',
    type: BadgeType.ACHIEVEMENT,
    criteria: {
      type: BadgeType.ACHIEVEMENT,
      requirement: {
        metric: 'EARLY_COMPLETION',
        value: 86400, // seconds (24 hours)
      },
    },
  },
  {
    name: 'Top Scorer',
    description: 'Achieve the highest score in any level',
    icon: '👑',
    type: BadgeType.ACHIEVEMENT,
    criteria: {
      type: BadgeType.ACHIEVEMENT,
      requirement: {
        metric: 'HIGHEST_SCORE_COUNT',
        value: 1,
      },
    },
  },
];
