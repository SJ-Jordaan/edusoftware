import { APIGatewayProxyEventV2 } from 'aws-lambda';
import {
  BadRequestError,
  NotFoundError,
  LambdaResponse,
  ApplicationError,
  OrganisationRole,
} from '@edusoftware/core/types';
import { handler, useSessionWithRoles } from '@edusoftware/core/handlers';
import { Question, connectToDatabase } from '@edusoftware/core/databases';

/**
 * Deletes an existing question based on the provided ID in the path parameters.
 *
 * @param {APIGatewayProxyEventV2} event - The event object from AWS Lambda, containing the path parameters.
 * @returns {Promise<LambdaResponse<{ message: string }>>} A promise that resolves with a confirmation message.
 * @throws {BadRequestError} If the question ID is not provided in the path parameters.
 * @throws {NotFoundError} If no question with the specified ID is found.
 */
export const main = handler<{ message: string }>(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<LambdaResponse<{ message: string }>> => {
    await useSessionWithRoles([
      OrganisationRole.ADMIN,
      OrganisationRole.LECTURER,
    ]);

    if (!event.pathParameters || !event.pathParameters.id) {
      throw new BadRequestError('Question ID must be provided in the path');
    }

    const questionId = event.pathParameters.id;

    await connectToDatabase();

    try {
      const question = await Question.findByIdAndDelete(questionId);

      if (!question) {
        throw new NotFoundError(`Question with ID ${questionId}`);
      }

      return {
        statusCode: 200,
        body: { message: 'Question removed' },
      };
    } catch (error: unknown) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      if (error instanceof Error) {
        console.error(`Failed to delete question: ${error.message}`);
        throw new ApplicationError(
          `Failed to delete question: ${error.message}`,
          500,
        );
      }

      console.error(`Failed to delete question: ${error}`);
      throw new ApplicationError(
        'Failed to delete question due to unexpected error',
        500,
      );
    }
  },
);
