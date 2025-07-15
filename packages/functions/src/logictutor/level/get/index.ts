import { connectToDatabase } from '@edusoftware/core/databases';
import {
  LogictutorLevelModel,
  LogictutorQuestionModel,
} from '@edusoftware/core/databases/logictutor';
import { handler } from '@edusoftware/core/handlers';
import {
  ApplicationError,
  BadRequestError,
  LambdaResponse,
  LogictutorFullLevel,
} from '@edusoftware/core/types';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

/**
 * Lambda function to retrieve all levels without full question details.
 *
 * @returns {Promise<LambdaResponse<Array<{ levelName: string; description: string; difficulty: string; questionIds?: string[]; updatedAt?: string }>>>}
 */
export const main = handler<{
  levelName: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  timeLimit?: number;
  enableToolbar: boolean;
  showTruthTable: boolean;
  questions?: Array<{
    questionContent: string;
    booleanExpression: string;
    hints?: string[];
    outputSymbol: string;
  }>;
  updatedAt?: string;
  _id: string;
}>(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<
    LambdaResponse<{
      levelName: string;
      description: string;
      difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
      timeLimit?: number;
      enableToolbar: boolean;
      showTruthTable: boolean;
      questions?: Array<{
        questionContent: string;
        booleanExpression: string;
        hints?: string[];
        outputSymbol: string;
      }>;
      updatedAt?: string;
      _id: string;
    }>
  > => {
    const levelId = event.queryStringParameters?.levelId;

    if (!levelId) {
      throw new BadRequestError('Missing levelId parameter');
    }

    await connectToDatabase();

    try {
      const level = await LogictutorLevelModel.findById(levelId);

      if (!level) {
        throw new Error(`Level with ID ${levelId} not found`);
      }

      const questions = await LogictutorQuestionModel.find({
        _id: { $in: level.questionIds },
      });

      const result: LogictutorFullLevel = {
        ...level.toObject(),
        questions: questions.map((q) => q.toObject()),
      };

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
