import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { handler, useSessionWithRoles } from '@edusoftware/core/handlers';
import {
  BadRequestError,
  NotFoundError,
  LambdaResponse,
} from '@edusoftware/core/types';
import { connectToDatabase } from '@edusoftware/core/databases';
import {
  LogictutorLeaderboardModel,
  LogictutorLevelModel,
} from '@edusoftware/core/databases/logictutor';
import mongoose from 'mongoose';

export const main = handler<{
  levelId: string;
  levelName: string;
  description: string;
  userScore: {
    userId: string;
    userName: string;
    score: number;
  } | null;
}>(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<
    LambdaResponse<{
      levelId: string;
      levelName: string;
      description: string;
      userScore: {
        userId: string;
        userName: string;
        score: number;
      } | null;
    }>
  > => {
    const levelId = event.queryStringParameters?.levelId;

    if (!levelId) {
      throw new BadRequestError('Query parameter "levelId" is required');
    }

    if (!mongoose.Types.ObjectId.isValid(levelId)) {
      throw new BadRequestError('Invalid levelId format');
    }

    await connectToDatabase();

    const { userId } = await useSessionWithRoles();

    try {
      // Get the Level info regardless
      const level = await LogictutorLevelModel.findOne({
        _id: new mongoose.Types.ObjectId(levelId),
      }).lean();

      if (!level) {
        throw new NotFoundError(`Level not found for levelId: ${levelId}`);
      }

      // Check if leaderboard exists
      const leaderboard = await LogictutorLeaderboardModel.findOne({
        levelId: new mongoose.Types.ObjectId(levelId),
      }).lean();

      const userScore =
        leaderboard?.userScores?.find((entry) => entry.userId === userId) ??
        null;

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
