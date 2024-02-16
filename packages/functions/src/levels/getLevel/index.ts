import { Level, connectToDatabase } from '@edusoftware/core/databases';
import { handler } from '@edusoftware/core/handlers';
import {
  BadRequestError,
  LambdaResponse,
  NotFoundError,
  PopulatedLevel,
} from '@edusoftware/core/types';
import { APIGatewayProxyEvent } from 'aws-lambda';

/**
 * Lambda function to retrieve a specific level by its ID, including all related question IDs.
 * It validates the request, fetches the level, and handles errors appropriately.
 *
 * @param {APIGatewayProxyEvent} event - The event object from AWS Lambda, containing the request parameters.
 * @returns {Promise<LambdaResponse<PopulatedLevel>>} A promise that resolves to the fetched level data.
 * @throws {BadRequestError} Thrown if the level ID is not provided in the request.
 * @throws {NotFoundError} Thrown if no level is found matching the provided ID.
 */
export const main = handler<PopulatedLevel>(
  async (
    event: APIGatewayProxyEvent,
  ): Promise<LambdaResponse<PopulatedLevel>> => {
    await connectToDatabase();
    const levelId = event.pathParameters?.id;

    if (!levelId) {
      throw new BadRequestError('Level ID must be provided');
    }

    try {
      const levelDoc = await Level.findById(levelId).populate('questionIds');

      if (!levelDoc) {
        throw new NotFoundError(`Level with ID ${levelId} not found`);
      }

      const level: PopulatedLevel = levelDoc.toObject();

      return {
        statusCode: 200,
        body: level,
      };
    } catch (error: unknown) {
      // Log generic errors for debugging purposes
      console.error(`An error occurred while fetching the level: ${error}`);
      throw error;
    }
  },
);
