import { APIGatewayProxyEvent } from 'aws-lambda';
import {
  BadRequestError,
  NotFoundError,
  ApplicationError,
  LambdaResponse,
  UpdateQuestionSchema,
  Question as IQuestion,
} from '@edusoftware/core/types';
import { handler } from '@edusoftware/core/handlers';
import { Question, connectToDatabase } from '@edusoftware/core/databases';

/**
 * AWS Lambda function to update an existing question. Validates incoming data against a Zod schema,
 * fetches the existing question, updates it with provided data, and saves the changes.
 *
 * @param {APIGatewayProxyEvent} event - The event object from AWS Lambda, containing the path parameters and request body.
 * @returns {Promise<LambdaResponse<any>>} A promise that resolves with the updated question data.
 * @throws {BadRequestError} If the request body is missing or invalid, or if required fields are missing.
 * @throws {NotFoundError} If the question with the specified ID is not found.
 */
export const main = handler<IQuestion>(
  async (event: APIGatewayProxyEvent): Promise<LambdaResponse<IQuestion>> => {
    if (!event.body) {
      throw new BadRequestError('Request body is required');
    }

    const questionId = event.pathParameters?.id;
    if (!questionId) {
      throw new BadRequestError('Question ID must be provided in the path');
    }

    let parsedData;
    try {
      parsedData = UpdateQuestionSchema.parse(JSON.parse(event.body));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? `Invalid update data: ${error.message}`
          : 'Invalid update data and could not parse error details';
      throw new BadRequestError(errorMessage);
    }

    await connectToDatabase();

    try {
      const question = await Question.findById(questionId);
      if (!question) {
        throw new NotFoundError(`Question with ID ${questionId}`);
      }

      Object.assign(question, parsedData);
      const updatedQuestion = await question.save();
      return {
        statusCode: 200,
        body: updatedQuestion.toObject(),
      };
    } catch (error: unknown) {
      console.error(
        `Failed to update question: ${error instanceof Error ? error.message : error}`,
      );
      throw new ApplicationError(
        'Failed to update question due to unexpected error',
        500,
      );
    }
  },
);
