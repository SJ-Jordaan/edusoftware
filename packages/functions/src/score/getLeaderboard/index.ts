import { Score, connectToDatabase } from '@edusoftware/core/databases';
import { handler } from '@edusoftware/core/handlers';
import {
  ApplicationError,
  LambdaResponse,
  NotFoundError,
  UserScore,
} from '@edusoftware/core/types';

/**
 * Lambda function to retrieve the global leaderboard.
 * It fetches the leaderboard, and handles errors appropriately.
 * @returns {Promise<LambdaResponse<UserScore[]>>} A promise that resolves to the fetched leaderboard data.
 * @throws {NotFoundError} Thrown if no leaderboard data is found.
 * @throws {ApplicationError} Thrown if an unexpected error occurs while fetching the leaderboard.
 */
export const main = handler<UserScore[]>(
  async (
  ): Promise<LambdaResponse<UserScore[]>> => {
    await connectToDatabase();

    try {
      let aggregatePipeline = [];
      aggregatePipeline.push(
        {
          $group: {
            _id: '$userId',
            totalScore: { $sum: '$score' },
          },
        },
        { $sort: { totalScore: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        { $unwind: '$userDetails' },
        {
          $project: {
            _id: 0,
            totalScore: 1,
            userDetails: {
              name: '$userDetails.name',
            },
          },
        });

      const leaderboard = await Score.aggregate(aggregatePipeline);

      if (!leaderboard || leaderboard.length === 0) {
        throw new NotFoundError('Leaderboard data not found.');
      }

      return {
        statusCode: 200,
        body: leaderboard,
      };
    } catch (error: unknown) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      if (error instanceof Error) {
        console.error(`Failed to get leaderboard: ${error.message}`);
        throw new ApplicationError(
          `Failed to get leaderboard: ${error.message}`,
          500,
        );
      }

      console.error(`Failed to get leaderboard: ${error}`);
      throw new ApplicationError(
        'Failed to get leaderboard due to unexpected error',
        500,
      );
    }
  },
);