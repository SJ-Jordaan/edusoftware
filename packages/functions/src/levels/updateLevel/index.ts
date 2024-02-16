import { APIGatewayProxyEvent } from 'aws-lambda';
import {
  BadRequestError,
  NotFoundError,
  ApplicationError,
  LambdaResponse,
  Level as ILevel,
  UpdateLevelSchema,
} from '@edusoftware/core/types';
import { handler } from '@edusoftware/core/handlers';
import { Level, connectToDatabase } from '@edusoftware/core/databases';

/**
 * Updates an existing level based on the provided data in the request body.
 * Validates the incoming data against a Zod schema for updates, fetches the existing level,
 * updates it with provided data, and saves the changes.
 *
 * @param {APIGatewayProxyEvent} event - The event object from AWS Lambda, containing the path parameters and request body.
 * @returns {Promise<LambdaResponse<ILevel>>} A promise that resolves with the updated level data.
 * @throws {BadRequestError} If the request body is missing or invalid.
 * @throws {NotFoundError} If the level with the specified ID is not found.
 */
export const main = handler<ILevel>(
  async (event: APIGatewayProxyEvent): Promise<LambdaResponse<ILevel>> => {
    if (!event.body) {
      throw new BadRequestError('Request body is required');
    }

    const levelId = event.pathParameters?.id;
    if (!levelId) {
      throw new BadRequestError('Level ID must be provided in the path');
    }

    let parsedData: Partial<ILevel>;
    try {
      parsedData = UpdateLevelSchema.parse(JSON.parse(event.body));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? `Invalid update data: ${error.message}`
          : 'Invalid update data and could not parse error details';
      throw new BadRequestError(errorMessage);
    }

    await connectToDatabase();

    try {
      const level = await Level.findById(levelId);
      if (!level) {
        throw new NotFoundError(`Level with ID ${levelId}`);
      }

      Object.assign(level, parsedData);
      const updatedLevel = await level.save();
      return {
        statusCode: 200,
        body: updatedLevel.toObject(), // Convert Mongoose document to object
      };
    } catch (error: unknown) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      if (error instanceof Error) {
        console.error(`Failed to update level: ${error.message}`);
        throw new ApplicationError(
          `Failed to update level: ${error.message}`,
          500,
        );
      }

      console.error(`Failed to update level: ${error}`);
      throw new ApplicationError(
        'Failed to update level due to unexpected error',
        500,
      );
    }
  },
);
