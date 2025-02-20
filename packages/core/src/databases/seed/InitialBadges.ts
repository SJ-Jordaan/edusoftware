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
