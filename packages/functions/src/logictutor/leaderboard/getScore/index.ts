import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { handler, useSessionWithRoles } from '@edusoftware/core/handlers';
import {
  BadRequestError,
  NotFoundError,
  LambdaResponse,
  LogictutorUserScoreResponse,
} from '@edusoftware/core/types';
import { connectToDatabase } from '@edusoftware/core/databases';
import {
  LogictutorLeaderboardModel,
  LogictutorLevelModel,
} from '@edusoftware/core/databases/logictutor';

export const main = handler<LogictutorUserScoreResponse>(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<LambdaResponse<LogictutorUserScoreResponse>> => {
    const levelId = event.queryStringParameters?.levelId;

    if (!levelId) {
      throw new BadRequestError('Query parameter "levelId" is required');
    }

    await connectToDatabase();

    const { userId } = await useSessionWithRoles();

    try {
      // Get the Level info regardless
      const level = await LogictutorLevelModel.findOne({
        _id: levelId,
      }).lean();

      if (!level) {
        throw new NotFoundError(`Level not found for levelId: ${levelId}`);
      }

      // Check if leaderboard exists
      const leaderboard = await LogictutorLeaderboardModel.findOne({
        levelId: levelId,
      }).lean();

      const userScore = leaderboard?.userScores?.find(
        (entry) => entry.userId === userId,
      );

      return {
        statusCode: 200,
        body: {
          levelId,
          levelName: level.levelName,
          description: level.description,
          userScore,
        },
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error while retrieving score';
      throw new BadRequestError(message);
    }
  },
);
