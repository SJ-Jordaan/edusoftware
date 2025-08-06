import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { handler } from '@edusoftware/core/handlers';
import {
  BadRequestError,
  NotFoundError,
  LambdaResponse,
  LogictutorLeaderboard,
} from '@edusoftware/core/types';
import { connectToDatabase } from '@edusoftware/core/databases';
import {
  LogictutorLeaderboardModel,
  LogictutorLevelModel,
} from '@edusoftware/core/databases/logictutor';
import mongoose from 'mongoose';

export const main = handler<LogictutorLeaderboard>(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<LambdaResponse<LogictutorLeaderboard>> => {
    const levelId = event.queryStringParameters?.levelId;

    if (!levelId) {
      throw new BadRequestError('Query parameter "levelId" is required');
    }

    // Validate if levelId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(levelId)) {
      throw new BadRequestError('Invalid levelId format');
    }

    await connectToDatabase();

    try {
      const leaderboard = await LogictutorLeaderboardModel.findOne({
        levelId: new mongoose.Types.ObjectId(levelId),
      });

      if (!leaderboard) {
        const level = await LogictutorLevelModel.findById(levelId).lean();

        if (!level)
          throw new NotFoundError(
            `Leaderboard not found for levelId: ${levelId}`,
          );

        return {
          statusCode: 200,
          body: {
            levelId,
            levelName: level.levelName,
            description: level.description,
            userScores: [],
          },
        };
      }

      const rawLeaderboard = leaderboard.toObject();

      return {
        statusCode: 200,
        body: {
          ...rawLeaderboard,
          levelId,
          userScores: rawLeaderboard.userScores ?? [],
        },
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error retrieving leaderboard';
      throw new BadRequestError(message);
    }
  },
);
