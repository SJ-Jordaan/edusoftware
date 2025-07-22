import { Badge } from '@edusoftware/core/types';
import { connectToDatabase } from '@edusoftware/core/databases';
import { handler, useSessionWithRoles } from '@edusoftware/core/handlers';
import { ApplicationError, LambdaResponse } from '@edusoftware/core/types';
import { BadgeModel, UserBadgeModel } from '@edusoftware/core/databases';

interface UserBadgesResponse {
  badges: Badge[];
}

export const main = handler<UserBadgesResponse>(
  async (): Promise<LambdaResponse<UserBadgesResponse>> => {
    const user = await useSessionWithRoles();

    await connectToDatabase();

    try {
      const userBadges = await UserBadgeModel.find({
        userId: user.userId,
      }).lean();

      const badgeIds = userBadges.map((ub) => ub.badgeId);

      const badges = await BadgeModel.find({
        _id: { $in: badgeIds },
      }).lean();

      return {
        statusCode: 200,
        body: {
          badges,
        },
      };
    } catch (error) {
      console.error('Failed to fetch user badges:', error);
      throw new ApplicationError(
        'Failed to fetch user badges due to unexpected error',
        500,
      );
    }
  },
);
