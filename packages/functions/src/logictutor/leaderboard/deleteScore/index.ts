import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { handler, useSessionWithRoles } from '@edusoftware/core/handlers';
import {
  BadRequestError,
  NotFoundError,
  LambdaResponse,
  OrganisationRole,
} from '@edusoftware/core/types';
import { connectToDatabase } from '@edusoftware/core/databases';
import { LogictutorLeaderboardModel } from '@edusoftware/core/databases/logictutor';

export interface LogictutorDeleteScoreRequest {
  userId: string;
  levelId: string;
}

export const main = handler<string>(
  async (event: APIGatewayProxyEventV2): Promise<LambdaResponse<string>> => {
    if (!event.body) {
      throw new BadRequestError('Request body is required');
    }

    let parsedBody: LogictutorDeleteScoreRequest;
    try {
      parsedBody = JSON.parse(event.body);
    } catch {
      throw new BadRequestError('Invalid JSON');
    }

    const { userId, levelId } = parsedBody;

    if (!userId || typeof userId !== 'string') {
      throw new BadRequestError('userId is required and must be a string');
    }

    if (!levelId || typeof levelId !== 'string') {
      throw new BadRequestError('levelId is required and must be a string');
    }

    await connectToDatabase();

    await useSessionWithRoles([OrganisationRole.ADMIN]);

    try {
      const leaderboard = await LogictutorLeaderboardModel.findOne({
        levelId: levelId,
      });

      if (!leaderboard) {
        throw new NotFoundError('Leaderboard not found for this level');
      }

      const scoreIndex = leaderboard.userScores?.findIndex(
        (entry) => entry.userId.toString() === userId.toString(),
      );

      if (scoreIndex === undefined || scoreIndex === -1) {
        throw new NotFoundError('Score not found for this user and level');
      }

      leaderboard.userScores?.splice(scoreIndex, 1);

      await leaderboard.save();

      return {
        statusCode: 200,
        body: 'Score successfully deleted',
      };
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw err;
      }

      const message =
        err instanceof Error ? err.message : 'Error while deleting score';
      throw new BadRequestError(message);
    }
  },
);
