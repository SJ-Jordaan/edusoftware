import { Progress } from '../../databases';
import { BadgeStrategy } from '../BadgeStrategy';

export class PracticeLevelsStrategy implements BadgeStrategy {
  metric = 'PRACTICE_LEVELS_COMPLETED';

  async verify(userId: string): Promise<number> {
    const completedPracticeLevels = await Progress.countDocuments({
      userId,
      'level.isPractice': true,
      completedAt: { $ne: null },
    });

    return completedPracticeLevels;
  }
}
