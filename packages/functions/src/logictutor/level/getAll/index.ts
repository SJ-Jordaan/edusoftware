import { connectToDatabase } from '@edusoftware/core/databases';
import {
  LogictutorLeaderboardModel,
  LogictutorLevelModel,
} from '@edusoftware/core/databases/logictutor';
import { handler, useSessionWithRoles } from '@edusoftware/core/handlers';
import {
  ApplicationError,
  LambdaResponse,
  LogictutorScore,
} from '@edusoftware/core/types';

/**
 * Lambda function to retrieve all levels without full question details.
 *
 * @returns {Promise<LambdaResponse<Array<{ levelName: string; description: string; difficulty: string; questionIds?: string[]; updatedAt?: string }>>>}
 */
export const main = handler<
  Array<{
    levelName: string;
    description: string;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    questionIds?: string[];
    updatedAt?: string;
    timeLimit?: number;
    hide: boolean;
  }>
>(
  async (): Promise<
    LambdaResponse<
      Array<{
        levelName: string;
        description: string;
        difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
        questionIds?: string[];
        updatedAt?: string;
        timeLimit?: number;
        userScore?: LogictutorScore;
        hide: boolean;
        _id: string;
      }>
    >
  > => {
    await connectToDatabase();

    try {
      const [levels, leaderboards, { userId }] = await Promise.all([
        LogictutorLevelModel.find(),
        LogictutorLeaderboardModel.find(),
        useSessionWithRoles(),
      ]);

      const result = levels.map((level) => {
        const leaderboard = leaderboards.find((leaderboard) => {
          // Convert both IDs to strings for comparison
          return leaderboard.levelId.toString() === level._id.toString();
        });

        const userScore = leaderboard?.userScores?.find((score) => {
          // Convert both user IDs to strings for comparison
          return score.userId.toString() === userId.toString();
        });

        return {
          levelName: level.levelName,
          description: level.description,
          difficulty: level.difficulty,
          updatedAt: level.updatedAt,
          questionIds: level.questionIds?.map((id) => id.toString()),
          _id: level._id.toString(),
          hide: level.hide,
          userScore,
        };
      });

      return {
        statusCode: 200,
        body: result,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Failed to fetch levels: ${error.message}`);
        throw new ApplicationError(
          `Failed to fetch levels: ${error.message}`,
          500,
        );
      }

      console.error(`Unknown error occurred while fetching levels: ${error}`);
      throw new ApplicationError(
        'Failed to fetch levels due to unexpected error',
        500,
      );
    }
  },
);
