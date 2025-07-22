import { Level, connectToDatabase } from '@edusoftware/core/databases';
import { handler, useSessionWithRoles } from '@edusoftware/core/handlers';
import {
  ApplicationError,
  GetLevelsQueryParams,
  LambdaResponse,
  PopulatedLevel,
} from '@edusoftware/core/types';

/**
 * Handler for fetching all levels from the database and returning them.
 * This function connects to the database, queries all level documents, and
 * populates their associated question IDs. If no levels are found, it returns
 * an empty array. Errors during database operations are caught and logged,
 * and may be re-thrown to be handled by the base handler, depending on the
 * application's error handling strategy.
 *
 * @returns {Promise<LambdaResponse<PopulatedLevel[]>>} A promise that resolves
 * to a LambdaResponse containing an array of populated levels. If no levels
 * are found, the array will be empty. In the case of an error, it re-throws
 * the error to be handled by the base error handling mechanism.
 */
export const main = handler<PopulatedLevel[]>(
  async (event): Promise<LambdaResponse<PopulatedLevel[]>> => {
    await connectToDatabase();
    const user = await useSessionWithRoles();

    const { isPractice, track } = (event.queryStringParameters ||
      {}) as GetLevelsQueryParams;

    try {
      const query: Record<string, unknown> = {
        organisation: { $in: user.organisations },
      };

      // Add filters if provided
      if (isPractice !== undefined) {
        query.isPractice = isPractice;
      }

      if (track) {
        query.track = track.toUpperCase();
      }

      const levels: PopulatedLevel[] =
        await Level.find(query).populate('questionIds');

      return {
        statusCode: 200,
        body: levels,
      };
    } catch (error: unknown) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      if (error instanceof Error) {
        console.error(`Failed to get levels: ${error.message}`);
        throw new ApplicationError(
          `Failed to get levels: ${error.message}`,
          500,
        );
      }

      console.error(`Failed to get levels: ${error}`);
      throw new ApplicationError(
        'Failed to get levels due to unexpected error',
        500,
      );
    }
  },
);
