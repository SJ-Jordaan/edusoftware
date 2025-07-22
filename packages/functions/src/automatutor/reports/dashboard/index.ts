import { DashboardReport, OrganisationRole } from '@edusoftware/core/types';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { connectToDatabase } from '@edusoftware/core/databases';
import { Score, Progress, Level } from '@edusoftware/core/databases';
import { handler, useSessionWithRoles } from '@edusoftware/core/handlers';
import { Table } from 'sst/node/table';
import { ApplicationError, LambdaResponse } from '@edusoftware/core/types';

interface EnhancedLevelStats {
  levelId: string;
  levelName: string;
  averageScore: number;
  totalStudents: number;
  completionRate: number;
  inProgress: number;
  completed: number;
}

export const main = handler<DashboardReport>(
  async (): Promise<LambdaResponse<DashboardReport>> => {
    await useSessionWithRoles([
      OrganisationRole.ADMIN,
      OrganisationRole.LECTURER,
    ]);

    await connectToDatabase();

    try {
      // Run queries in parallel
      const [userCount, levelStats] = await Promise.all([
        getUserCount(),
        getLevelStatistics(),
      ]);

      const adminData: DashboardReport = {
        userCount,
        levelStats,
        lastUpdated: new Date().toISOString(),
      };

      return {
        statusCode: 200,
        body: adminData,
      };
    } catch (error: unknown) {
      console.error('Failed to get admin data:', error);
      throw new ApplicationError(
        'Failed to get admin data due to unexpected error',
        500,
      );
    }
  },
);

async function getUserCount(): Promise<number> {
  const ddb = new DynamoDBClient({});
  const command = new ScanCommand({
    TableName: Table.users.tableName,
    Select: 'COUNT',
  });
  const response = await ddb.send(command);
  return response.Count || 0;
}

async function getLevelStatistics(): Promise<EnhancedLevelStats[]> {
  // Combined aggregation pipeline
  const progressPipeline = [
    {
      $group: {
        _id: '$levelId',
        totalStudents: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $ne: ['$completedAt', null] }, 1, 0] },
        },
      },
    },
  ];

  const scorePipeline = [
    {
      $group: {
        _id: '$levelId',
        averageScore: { $avg: '$score' },
        highestScore: { $max: '$score' },
        lowestScore: { $min: '$score' },
      },
    },
  ];

  // Run queries in parallel
  const [progressData, scoreData, levels] = await Promise.all([
    Progress.aggregate(progressPipeline).exec(),
    Score.aggregate(scorePipeline).exec(),
    Level.find({}, 'levelName').lean().exec(),
  ]);

  // Create a map for easier lookup
  const levelMap = new Map(
    levels.map((level) => [level._id.toString(), level.levelName]),
  );
  const scoreMap = new Map(
    scoreData.map((item) => [item._id.toString(), item]),
  );

  // Combine the data
  return progressData.map((progress) => {
    const levelId = progress._id.toString();
    const scoreInfo = scoreMap.get(levelId) || { averageScore: 0 };

    return {
      levelId,
      levelName: levelMap.get(levelId) || 'Unknown Level',
      averageScore: Math.round(scoreInfo.averageScore * 10) / 10,
      totalStudents: progress.totalStudents,
      completionRate: Math.round(
        (progress.completed / progress.totalStudents) * 100,
      ),
      inProgress: progress.totalStudents - progress.completed,
      completed: progress.completed,
    };
  });
}
