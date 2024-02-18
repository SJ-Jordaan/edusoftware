import {
  Level,
  Progress,
  connectToDatabase,
} from '@edusoftware/core/databases';
import { handler } from '@edusoftware/core/handlers';
import {
  ApplicationError,
  LambdaResponse,
  NotFoundError,
  UserProgress,
} from '@edusoftware/core/types';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { useSessionWithRoles } from '@edusoftware/core/handlers';

/**
 * Lambda function to retrieve a specific level by its ID, including all related question IDs.
 * It validates the request, fetches the level, and handles errors appropriately.
 *
 * @param {APIGatewayProxyEventV2} event - The event object from AWS Lambda, containing the request parameters.
 * @returns {Promise<LambdaResponse<UserProgress>>} A promise that resolves to the fetched level data.
 * @throws {NotFoundError} Thrown if no level is found matching the provided ID.
 */
export const main = handler<UserProgress>(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<LambdaResponse<UserProgress>> => {
    const levelId = event.pathParameters?.id;

    try {
      await connectToDatabase();
      const { userId } = await useSessionWithRoles();
      const levelDoc = await Level.findById(levelId);

      if (!levelDoc) {
        throw new NotFoundError(`Level with ID ${levelId}`);
      }

      let progress = await Progress.findOne({ userId, levelId });

      if (progress) {
        progress.questionsAttempted.pull({});
        progress.startedAt = new Date();
        progress.completedAt = null;
        progress.totalScore = 0;
      } else {
        progress = new Progress({ userId, levelId });
      }

      await progress.save();

      return {
        statusCode: 200,
        body: progress.toObject() as UserProgress,
      };
    } catch (error: unknown) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      if (error instanceof Error) {
        console.error(`Failed to get level: ${error.message}`);
        throw new ApplicationError(
          `Failed to get level: ${error.message}`,
          500,
        );
      }

      console.error(`Failed to get level: ${error}`);
      throw new ApplicationError(
        'Failed to get level due to unexpected error',
        500,
      );
    }
  },
);
