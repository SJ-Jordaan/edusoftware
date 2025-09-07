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

export interface LogictutorDeleteLeaderboardRequest {
  levelId: string;
}

export const main = handler<string>(
  async (event: APIGatewayProxyEventV2): Promise<LambdaResponse<string>> => {
    if (!event.body) {
      throw new BadRequestError('Request body is required');
    }

    let parsedBody: LogictutorDeleteLeaderboardRequest;
    try {
      parsedBody = JSON.parse(event.body);
    } catch {
      throw new BadRequestError('Invalid JSON');
    }

    const { levelId } = parsedBody;

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

      const scoreCount = leaderboard.userScores?.length || 0;

      await LogictutorLeaderboardModel.findByIdAndDelete(leaderboard._id);

      return {
        statusCode: 200,
        body: `Leaderboard successfully deleted (removed ${scoreCount} score${scoreCount !== 1 ? 's' : ''})`,
      };
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw err;
      }

      const message =
        err instanceof Error ? err.message : 'Error while deleting leaderboard';
      throw new BadRequestError(message);
    }
  },
);
