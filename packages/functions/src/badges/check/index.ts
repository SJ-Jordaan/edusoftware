import { Badge, UserBadge } from '@edusoftware/core/types';
import { connectToDatabase } from '@edusoftware/core/databases';
import { handler, useSessionWithRoles } from '@edusoftware/core/handlers';
import { ApplicationError, LambdaResponse } from '@edusoftware/core/types';
import { BadgeModel, UserBadgeModel } from '@edusoftware/core/databases';

interface BadgeCheckRequest {
  userId: string;
  metric: string;
  value: number;
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

    const { metric, value } = JSON.parse(event.body) as BadgeCheckRequest;

    if (!metric || value === undefined) {
      throw new ApplicationError('Missing required parameters', 400);
    }

    await connectToDatabase();

    try {
      // Find badges that match the metric and value requirement
      const eligibleBadges = await BadgeModel.find({
        'criteria.requirement.metric': metric,
        'criteria.requirement.value': { $lte: value },
      }).lean();

      // Check which badges haven't been earned yet
      const userBadges = (await UserBadgeModel.find({
        userId,
      }).lean()) as UserBadge[];
      const earnedBadgeIds = userBadges.map((ub) => ub.badgeId.toString());

      const newBadges = eligibleBadges.filter(
        (badge) => !earnedBadgeIds.includes(badge._id.toString()),
      );

      // Award new badges
      if (newBadges.length > 0) {
        const badgesToAward: Omit<UserBadge, '_id'>[] = newBadges.map(
          (badge) => ({
            userId,
            badgeId: badge._id,
            earnedAt: new Date(),
          }),
        );

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
