import { connectToDatabase } from '@edusoftware/core/databases';
import { LogictutorQuestionModel } from '@edusoftware/core/databases/logictutor';
import { handler } from '@edusoftware/core/handlers';
import {
  ApplicationError,
  LambdaResponse,
  NotFoundError,
} from '@edusoftware/core/types';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

/**
 * Lambda function to retrieve all levels without full question details.
 *
 * @returns {Promise<LambdaResponse<Array<{ levelName: string; description: string; difficulty: string; questionIds?: string[]; updatedAt?: string }>>>}
 */
export const main = handler<{
  questionContent: string;
  hints?: string[];
  score: number;
  booleanExpression: string;
}>(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<
    LambdaResponse<{
      questionContent: string;
      hints?: string[];
      score: number;
      booleanExpression: string;
    }>
  > => {
    await connectToDatabase();

    try {
      const questionId = event.queryStringParameters?.questionId;
      const question = await LogictutorQuestionModel.findById(questionId);

      if (!question) {
        throw new NotFoundError('Question not found');
      }

      const result = question.toObject();

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
