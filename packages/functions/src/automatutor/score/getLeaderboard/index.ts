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
import { PipelineStage } from 'mongoose';

export const main = handler<LeaderboardResponse>(
  async (): Promise<LambdaResponse<LeaderboardResponse>> => {
    await connectToDatabase();

    try {
      // First pipeline: Get overall top 10
      const overallPipeline: PipelineStage[] = [
        {
          $lookup: {
            from: 'levels',
            localField: 'levelId',
            foreignField: '_id',
            as: 'levelDetails',
          },
        },
        { $unwind: { path: '$levelDetails' } },
        {
          $match: {
            'levelDetails.isPractice': { $ne: true },
          },
        },
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

      // Second pipeline: Get top 10 per level
      const perLevelPipeline: PipelineStage[] = [
        {
          $lookup: {
            from: 'levels',
            localField: 'levelId',
            foreignField: '_id',
            as: 'levelDetails',
          },
        },
        { $unwind: { path: '$levelDetails' } },
        {
          $match: {
            'levelDetails.isPractice': { $ne: true },
          },
        },
        {
          $sort: { score: -1 },
        },
        {
          $group: {
            _id: '$levelId',
            topScores: {
              $push: {
                userId: '$userId',
                score: '$score',
                levelName: '$levelDetails.levelName',
                organisation: '$levelDetails.organisation',
                achievedAt: '$createdAt',
              },
            },
          },
        },
        {
          $project: {
            levelId: '$_id',
            topScores: { $slice: ['$topScores', 10] },
          },
        },
      ];

      const [overallLeaderboard, perLevelLeaderboard] = await Promise.all([
        Score.aggregate(overallPipeline),
        Score.aggregate(perLevelPipeline),
      ]);

      // Combine unique userIds from both leaderboards
      const userIds = new Set([
        ...overallLeaderboard.map((score) => score.userId),
        ...perLevelLeaderboard.flatMap((level) =>
          level.topScores.map((score) => score.userId),
        ),
      ]);

      // Fetch user details from DynamoDB
      const ddb = new DynamoDBClient({});
      const userKeys = Array.from(userIds).map((userId) =>
        marshall({ userId }),
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

      // Format the response
      return {
        statusCode: 200,
        body: {
          overall: formatLeaderboardEntries(overallLeaderboard, usersMap),
          perLevel: perLevelLeaderboard.map((level) => ({
            levelId: level._id.toString(),
            scores: formatLeaderboardEntries(level.topScores, usersMap),
          })),
        },
      };
    } catch (error: unknown) {
      console.error('Leaderboard error:', error);
      throw new ApplicationError(
        'Failed to fetch leaderboard',
        error instanceof ApplicationError ? error.statusCode : 500,
      );
    }
  },
);

// Helper function to format leaderboard entries
const formatLeaderboardEntries = (
  scores: any[],
  usersMap: Map<string, any>,
) => {
  return scores.map((score, index) => {
    const user = usersMap.get(score.userId);
    return {
      userId: score.userId,
      rank: index + 1,
      totalScore: score.totalScore || score.score,
      userDetails: {
        name: user?.name || 'Unknown User',
        email: user?.email || null,
        picture: user?.picture || null,
      },
      organizationId: user?.organizationId || 'Unknown Organization',
      scores: score.scores || [],
    };
  });
};
