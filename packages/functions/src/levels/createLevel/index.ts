import { Level, connectToDatabase } from '@edusoftware/core/databases';
import { handler, useSessionWithRoles } from '@edusoftware/core/handlers';
import {
  BadRequestError,
  LambdaResponse,
  Level as ILevel,
  LevelSchema,
  ApplicationError,
  OrganisationRole,
} from '@edusoftware/core/types';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

/**
 * AWS Lambda function to create a new level. Validates incoming data against a Zod schema,
 * checks for existing levels with the same name, and creates a new level if validations pass.
 *
 * @param {APIGatewayProxyEventV2} event - The event object from AWS Lambda, containing the request body.
 * @returns {Promise<LambdaResponse<Level>>} A promise that resolves with the created level data.
 * @throws {BadRequestError} For any validation failures or if the level already exists.
 */
export const main = handler<ILevel>(
  async (event: APIGatewayProxyEventV2): Promise<LambdaResponse<ILevel>> => {
    await useSessionWithRoles([
      OrganisationRole.ADMIN,
      OrganisationRole.LECTURER,
    ]);

    if (!event.body) {
      throw new BadRequestError('Request body is required');
    }

    let parsedData: ILevel;
    try {
      parsedData = LevelSchema.parse(JSON.parse(event.body));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Invalid level data and could not parse error details';
      throw new BadRequestError(errorMessage);
    }

    await connectToDatabase();

    try {
      const {
        levelName,
        description,
        questionIds,
        startDate,
        endDate,
        organisation,
        difficulty,
        track,
        isPractice,
      } = parsedData;
      const levelDoc = await Level.create({
        levelName,
        description,
        questionIds,
        startDate,
        endDate,
        organisation,
        difficulty,
        track,
        isPractice,
      });

      if (!levelDoc) {
        throw new ApplicationError('Failed to create level', 500);
      }

      const level: ILevel = levelDoc.toObject();

      return {
        statusCode: 201,
        body: level,
      };
    } catch (error: unknown) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      if (error instanceof Error) {
        console.error(`Failed to create level: ${error.message}`);
        throw new ApplicationError(
          `Failed to create level: ${error.message}`,
          500,
        );
      }

      console.error(`Failed to create level: ${error}`);
      throw new ApplicationError(
        'Failed to create level due to unexpected error',
        500,
      );
    }
  },
);
