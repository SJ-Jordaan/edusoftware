import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { handler } from '@edusoftware/core/handlers';
import {
  BadRequestError,
  ApplicationError,
  QuestionSchema,
  LambdaResponse,
  Question as IQuestion,
} from '@edusoftware/core/types';
import { Question, connectToDatabase } from '@edusoftware/core/databases';

/**
 * AWS Lambda function to create a new question. Validates incoming data against a Zod schema,
 * and creates a new question if validations pass.
 *
 * @param {APIGatewayProxyEventV2} event - The event object from AWS Lambda, containing the request body.
 * @returns {Promise<LambdaResponse<IQuestion>>} A promise that resolves with the created question data.
 * @throws {BadRequestError} For any validation failures.
 */
export const main = handler<IQuestion>(
  async (event: APIGatewayProxyEventV2): Promise<LambdaResponse<IQuestion>> => {
    if (!event.body) {
      throw new BadRequestError('Request body is required');
    }

    let parsedData: IQuestion;

    try {
      parsedData = QuestionSchema.parse(JSON.parse(event.body));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? `Invalid question data: ${error.message}`
          : 'Invalid question data and could not parse error details';
      throw new BadRequestError(errorMessage);
    }

    await connectToDatabase();

    try {
      const questionDoc = await Question.create(parsedData);

      if (!questionDoc) {
        throw new ApplicationError('Failed to create question', 500);
      }

      const createdQuestion: IQuestion = questionDoc.toObject();

      return {
        statusCode: 201,
        body: createdQuestion,
      };
    } catch (error: unknown) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      if (error instanceof Error) {
        console.error(`Failed to create question: ${error.message}`);
        throw new ApplicationError(
          `Failed to create question: ${error.message}`,
          500,
        );
      }

      console.error(`Failed to create question: ${error}`);
      throw new ApplicationError(
        'Failed to create question due to unexpected error',
        500,
      );
    }
  },
);
