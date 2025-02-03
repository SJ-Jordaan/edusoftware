import { Score, connectToDatabase } from '@edusoftware/core/databases';
import { DynamoDBClient, BatchGetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { handler } from '@edusoftware/core/handlers';
import { Table } from 'sst/node/table';
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
  async (): Promise<LambdaResponse<UserScore[]>> => {
    await connectToDatabase(); // Assuming this connects to MongoDB

    try {
      // MongoDB aggregation to get leaderboard scores
      const aggregatePipeline = [
        {
          $group: {
            _id: '$userId',
            totalScore: { $sum: '$score' },
          },
        },
        { $sort: { totalScore: -1 } },
        { $limit: 10 },
      ];

      const leaderboardScores = await Score.aggregate(aggregatePipeline);

      if (!leaderboardScores) {
        throw new NotFoundError('Leaderboard data not found.');
      }

      if (leaderboardScores.length === 0) {
        return {
          statusCode: 200,
          body: [],
        };
      }

      // DynamoDB client setup
      const ddb = new DynamoDBClient({});

      // Prepare keys for BatchGetItem
      const keys = leaderboardScores.map((score) =>
        marshall({ userId: score._id }),
      );

      // Fetch user details from DynamoDB
      const userDetails = await ddb.send(
        new BatchGetItemCommand({
          RequestItems: {
            [Table.users.tableName]: {
              Keys: keys,
            },
          },
        }),
      );

      // Process response from DynamoDB
      const usersDetailsUnmarshalled = userDetails.Responses
        ? userDetails.Responses[Table.users.tableName].map((item) =>
            unmarshall(item),
          )
        : [];

      // Merge leaderboardScores with userDetails
      const leaderboard = leaderboardScores.map((score) => {
        const userDetails = usersDetailsUnmarshalled.find(
          (user) => user.userId === score._id,
        );
        return {
          totalScore: score.totalScore,
          userDetails: {
            name: userDetails ? userDetails.name : 'Unknown User',
            email: userDetails ? userDetails.email : null,
            picture: userDetails ? userDetails.picture : null,
          },
        };
      });

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
