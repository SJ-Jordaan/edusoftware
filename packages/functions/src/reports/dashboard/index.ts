import { DashboardReport } from '@edusoftware/core/types';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { connectToDatabase } from '@edusoftware/core/databases';
import { Score, Progress } from '@edusoftware/core/databases'; // Adjust imports as necessary
import { handler } from '@edusoftware/core/handlers';
import { Table } from 'sst/node/table';
import { ApplicationError, LambdaResponse } from '@edusoftware/core/types';

export const main = handler<DashboardReport>(
  async (): Promise<LambdaResponse<DashboardReport>> => {
    await connectToDatabase(); // Connect to MongoDB

    try {
      // Fetch all necessary statistics
      const userCount = await getUserCount();
      const averageScorePerLevel = await getAverageScorePerLevel();
      const progressBreakdown = await getProgressBreakdownByLevel();

      // Compile statistics into a single response object
      const adminData: DashboardReport = {
        userCount,
        averageScorePerLevel,
        progressBreakdown,
      };

      return {
        statusCode: 200,
        body: adminData,
      };
    } catch (error: unknown) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      console.error(`Failed to get admin data: ${error}`);
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

async function getAverageScorePerLevel(): Promise<
  Array<{ _id: string; averageScore: number }>
> {
  const aggregatePipeline = [
    {
      $group: {
        _id: '$levelId',
        averageScore: { $avg: '$score' },
      },
    },
  ];
  return Score.aggregate(aggregatePipeline).exec();
}

async function getProgressBreakdownByLevel(): Promise<
  Array<{
    _id: string;
    started: number;
    completed: number;
  }>
> {
  const aggregatePipeline = [
    {
      $group: {
        _id: '$levelId',
        started: { $sum: 1 },
        completed: {
          $sum: {
            $cond: [{ $ne: ['$completedAt', null] }, 1, 0],
          },
        },
      },
    },
  ];
  return Progress.aggregate(aggregatePipeline).exec();
}
