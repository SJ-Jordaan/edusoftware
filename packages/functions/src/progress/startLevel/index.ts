import {
  Level,
  Progress,
  Score,
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
 * Lambda function to retrieve the progress of a specific level by its ID.
 * It validates the request, fetches the level progress, and handles errors appropriately.
 *
 * @param {APIGatewayProxyEventV2} event - The event object from AWS Lambda, containing the request parameters.
 * @returns {Promise<LambdaResponse<UserProgress>>} A promise that resolves to the fetched user progress data.
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

      // Initiate both find operations without waiting for them to complete immediately
      const progressPromise = Progress.findOne({ userId, levelId });
      const scorePromise = Score.findOne({ userId, levelId });

      // Wait for both find operations to complete
      const [progress, score] = await Promise.all([
        progressPromise,
        scorePromise,
      ]);

      // If progress exists, delete it. Similarly, if score exists, delete it.
      // These deletions are independent and can be performed concurrently.
      const deletionPromises = [];
      if (progress) {
        deletionPromises.push(Progress.deleteOne({ userId, levelId }));
      }
      if (score) {
        deletionPromises.push(Score.deleteOne({ userId, levelId }));
      }
      await Promise.all(deletionPromises);

      // After deletions are complete, create a new progress record.
      const newProgress = new Progress({ userId, levelId });
      await newProgress.save();

      return {
        statusCode: 200,
        body: newProgress.toObject(),
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
