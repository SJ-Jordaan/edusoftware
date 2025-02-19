import { Score, connectToDatabase } from '@edusoftware/core/databases';
import { DynamoDBClient, BatchGetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { handler } from '@edusoftware/core/handlers';
import { Table } from 'sst/node/table';
import {
  ApplicationError,
  LambdaResponse,
  LeaderboardResponse,
} from '@edusoftware/core/types';

export const main = handler<LeaderboardResponse>(
  async (): Promise<LambdaResponse<LeaderboardResponse>> => {
    await connectToDatabase();

    try {
      // Ignore any levelId filtering here: we return all scores
      const pipeline = [
        {
          $lookup: {
            from: 'levels',
            localField: 'levelId',
            foreignField: '_id',
            as: 'levelDetails',
          },
        },
        { $unwind: '$levelDetails' },
        {
          $group: {
            _id: '$userId',
            totalScore: { $sum: '$score' },
            scores: {
              $push: {
                levelId: '$levelId',
                levelName: '$levelDetails.levelName',
                organisation: '$levelDetails.organisation',
                score: '$score',
                achievedAt: '$createdAt',
              },
            },
          },
        },
        { $sort: { totalScore: -1 } },
        { $limit: 10 },
        {
          $project: {
            userId: '$_id',
            totalScore: 1,
            scores: { $slice: ['$scores', -5] },
          },
        },
      ];

      const leaderboardScores = await Score.aggregate(pipeline);

      if (leaderboardScores.length === 0) {
        return { statusCode: 200, body: [] };
      }

      // Fetch user details from DynamoDB
      const ddb = new DynamoDBClient({});
      const userKeys = leaderboardScores.map((score) =>
        marshall({ userId: score.userId }),
      );

      const userDetails = await ddb.send(
        new BatchGetItemCommand({
          RequestItems: {
            [Table.users.tableName]: { Keys: userKeys },
          },
        }),
      );

      // Create a map of user details
      const usersMap = new Map(
        userDetails.Responses?.[Table.users.tableName]?.map((item) => {
          const user = unmarshall(item);
          return [user.userId, user];
        }) || [],
      );

      // Format the final response as expected by the UI
      const leaderboard = leaderboardScores.map((score, index) => {
        const user = usersMap.get(score.userId);
        return {
          userId: score.userId,
          rank: index + 1,
          totalScore: score.totalScore,
          userDetails: {
            name: user?.name || 'Unknown User',
            email: user?.email || null,
            picture: user?.picture || null,
          },
          scores: score.scores.map((entry: any) => ({
            levelId: entry.levelId.toString(),
            levelName: entry.levelName,
            score: entry.score,
            achievedAt: entry.achievedAt,
          })),
        };
      });

      return { statusCode: 200, body: leaderboard };
    } catch (error: unknown) {
      console.error('Leaderboard error:', error);

      throw new ApplicationError(
        'Failed to fetch leaderboard',
        error instanceof ApplicationError ? error.statusCode : 500,
      );
    }
  },
);
