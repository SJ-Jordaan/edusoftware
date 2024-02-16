import { Question, connectToDatabase } from '@edusoftware/core/databases';
import { handler } from '@edusoftware/core/handlers';
import {
  BadRequestError,
  LambdaResponse,
  NotFoundError,
  Question as IQuestion,
} from '@edusoftware/core/types';
import { APIGatewayProxyEvent } from 'aws-lambda';

/**
 * Lambda function to retrieve a specific question by its ID.
 * @param {APIGatewayProxyEvent} event - The event object from AWS Lambda, containing the request parameters.
 * @returns {Promise<LambdaResponse<IQuestion>>} A promise that resolves to the fetched question data.
 * @throws {BadRequestError} Thrown if the question ID is not provided in the request.
 * @throws {NotFoundError} Thrown if no question is found matching the provided ID.
 */
export const main = handler<IQuestion>(
  async (event: APIGatewayProxyEvent): Promise<LambdaResponse<IQuestion>> => {
    await connectToDatabase();
    const questionId = event.pathParameters?.id;

    if (!questionId) {
      throw new BadRequestError('Question ID must be provided');
    }

    try {
      const questionDoc = await Question.findById(questionId);

      if (!questionDoc) {
        throw new NotFoundError(`Question with ID ${questionId} not found`);
      }

      const question: IQuestion = questionDoc.toObject();

      return {
        statusCode: 200,
        body: question,
      };
    } catch (error: unknown) {
      // Log generic errors for debugging purposes
      console.error(`An error occurred while fetching the question: ${error}`);
      throw error;
    }
  },
);
