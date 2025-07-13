import { connectToDatabase } from '@edusoftware/core/databases';
import { LogictutorLevelModel } from '@edusoftware/core/databases/logictutor';
import { handler } from '@edusoftware/core/handlers';
import { ApplicationError, LambdaResponse } from '@edusoftware/core/types';

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
      }>
    >
  > => {
    await connectToDatabase();

    try {
      const levels = await LogictutorLevelModel.find();

      const result = levels.map((level) => ({
        levelName: level.levelName,
        description: level.description,
        difficulty: level.difficulty,
        updatedAt: level.updatedAt,
        questionIds: level.questionIds?.map((id) => id.toString()),
      }));

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
