import { APIGatewayProxyEvent } from 'aws-lambda';
import {
  BadRequestError,
  NotFoundError,
  LambdaResponse,
} from '@edusoftware/core/types';
import { handler } from '@edusoftware/core/handlers';
import { Level, connectToDatabase } from '@edusoftware/core/databases';

/**
 * Deletes an existing level based on the provided ID in the path parameters.
 *
 * @param {APIGatewayProxyEvent} event - The event object from AWS Lambda, containing the path parameters.
 * @returns {Promise<LambdaResponse<{ message: string }>>} A promise that resolves with a confirmation message.
 * @throws {BadRequestError} If the level ID is not provided in the path parameters.
 * @throws {NotFoundError} If no level with the specified ID is found.
 */
export const main = handler<{ message: string }>(
  async (
    event: APIGatewayProxyEvent,
  ): Promise<LambdaResponse<{ message: string }>> => {
    if (!event.pathParameters || !event.pathParameters.id) {
      throw new BadRequestError('Level ID must be provided in the path');
    }

    const levelId = event.pathParameters.id;

    await connectToDatabase();

    const level = await Level.findByIdAndDelete(levelId);

    if (!level) {
      throw new NotFoundError(`Level with ID ${levelId} not found`);
    }

    return {
      statusCode: 200,
      body: { message: 'Level removed' },
    };
  },
);
