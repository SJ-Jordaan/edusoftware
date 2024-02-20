import { Progress, connectToDatabase } from '@edusoftware/core/databases';
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
 * Lambda function to retrieve the user progress of a specific level by its ID, or all progress if no ID is provided.
 * It validates the request, fetches the progress, and handles errors appropriately.
 *
 * @param {APIGatewayProxyEventV2} event - The event object from AWS Lambda, containing the request parameters.
 * @returns {Promise<LambdaResponse<UserProgress[]>>} A promise that resolves to the fetched progress data.
 * @throws {NotFoundError} Thrown if no progress is found matching the provided ID.
 */
export const main = handler<UserProgress[]>(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<LambdaResponse<UserProgress[]>> => {
    const levelId = event.pathParameters?.id;

    try {
      await connectToDatabase();
      const { userId } = await useSessionWithRoles();
      let query: { userId: string; levelId?: string } = { userId };
      if (levelId) {
        query = { ...query, levelId };
      }

      const progressQuery = Progress.findOne(query).populate(
        'questionsAttempted.questionId',
      );

      const progress = levelId
        ? await progressQuery
        : await progressQuery.exec();

      if (!progress) {
        throw new NotFoundError('Progress');
      }

      return {
        statusCode: 200,
        body: progress.toObject() as UserProgress[],
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
