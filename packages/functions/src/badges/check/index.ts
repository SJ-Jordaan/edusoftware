import { Badge } from '@edusoftware/core/types';
import { connectToDatabase } from '@edusoftware/core/databases';
import { handler, useSessionWithRoles } from '@edusoftware/core/handlers';
import { ApplicationError, LambdaResponse } from '@edusoftware/core/types';
import { BadgeModel, UserBadgeModel } from '@edusoftware/core/databases';
import { StrategyFactory } from '@edusoftware/core/badges';

interface BadgeCheckRequest {
  userId: string;
  metric: string;
  value: number;
}

interface BadgeCheckRequest {
  metric: string;
}

interface BadgeCheckResponse {
  newBadges: Badge[];
}

export const main = handler<BadgeCheckResponse>(
  async (event): Promise<LambdaResponse<BadgeCheckResponse>> => {
    if (!event.body) {
      throw new ApplicationError('Missing request body', 400);
    }

    const { userId } = await useSessionWithRoles();
    const { metric } = JSON.parse(event.body) as BadgeCheckRequest;

    if (!metric) {
      throw new ApplicationError('Missing metric parameter', 400);
    }

    await connectToDatabase();

    try {
      // Get the appropriate strategy
      const strategy = StrategyFactory.getStrategy(metric);
      if (!strategy) {
        throw new ApplicationError('Invalid metric', 400);
      }

      // Verify the achievement
      const actualValue = await strategy.verify(userId);

      // Find eligible badges
      const eligibleBadges = await BadgeModel.find({
        'criteria.requirement.metric': metric,
        'criteria.requirement.value': { $lte: actualValue },
      }).lean();

      // Check which badges haven't been earned yet
      const userBadges = await UserBadgeModel.find({ userId }).lean();
      const earnedBadgeIds = userBadges.map((ub) => ub.badgeId.toString());

      const newBadges = eligibleBadges.filter(
        (badge) => !earnedBadgeIds.includes(badge._id.toString()),
      );

      // Award new badges
      if (newBadges.length > 0) {
        const badgesToAward = newBadges.map((badge) => ({
          userId,
          badgeId: badge._id,
          earnedAt: new Date(),
        }));

        await UserBadgeModel.insertMany(badgesToAward);
      }

      return {
        statusCode: 200,
        body: {
          newBadges,
        },
      };
    } catch (error) {
      console.error('Failed to check badge progress:', error);
      throw new ApplicationError(
        'Failed to check badge progress due to unexpected error',
        500,
      );
    }
  },
);
