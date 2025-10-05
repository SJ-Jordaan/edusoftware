import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { handler, useSessionWithRoles } from '@edusoftware/core/handlers';
import {
  BadRequestError,
  LambdaResponse,
  LogictutorAddScoreRequest,
} from '@edusoftware/core/types';
import { connectToDatabase } from '@edusoftware/core/databases';
import {
  LogictutorLeaderboardModel,
  LogictutorLevelModel,
} from '@edusoftware/core/databases/logictutor';

export const main = handler<string>(
  async (event: APIGatewayProxyEventV2): Promise<LambdaResponse<string>> => {
    if (!event.body) {
      throw new BadRequestError('Request body is required');
    }

    let parsedBody: LogictutorAddScoreRequest;
    try {
      parsedBody = JSON.parse(event.body);
    } catch {
      throw new BadRequestError('Invalid JSON');
    }

    const { levelId, score } = parsedBody;

    if (!levelId || typeof levelId !== 'string') {
      throw new BadRequestError('levelId is required and must be a string');
    }

    if (typeof score !== 'number' || isNaN(score)) {
      throw new BadRequestError('score is required and must be a valid number');
    }

    await connectToDatabase();

    // Get user session
    const { userId, name, picture, email } = await useSessionWithRoles(); // Securely fetched

    try {
      const leaderboard = await LogictutorLeaderboardModel.findOne({
        levelId: levelId,
      });

      if (!leaderboard) {
        const level = await LogictutorLevelModel.findById(levelId).lean();
        await LogictutorLeaderboardModel.create({
          levelId: levelId,
          levelName: level?.levelName, // Add logic to fetch name/desc if needed
          description: level?.description,
          userScores: [
            {
              userId,
              picture,
              email,
              userName: name,
              score,
            },
          ],
        });

        return {
          statusCode: 201,
          body: 'Leaderboard created and score added',
        };
      }

      // Check if this user already submitted a score
      const existingScore = leaderboard.userScores?.find(
        (entry) => entry.userId === userId,
      );

      if (existingScore) {
        throw new BadRequestError(
          'User has already submitted a score for this level',
        );
      }

      // Push new score and save
      leaderboard.userScores?.push({
        userId,
        userName: name,
        picture,
        email,
        score,
      });

      await leaderboard.save();

      return {
        statusCode: 200,
        body: 'Score successfully added',
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error while adding score';
      throw new BadRequestError(message);
    }
  },
);
