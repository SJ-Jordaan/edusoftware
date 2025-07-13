import { connectToDatabase, TestEntry } from '@edusoftware/core/databases';
import { handler } from '@edusoftware/core/handlers';
import {
  ApplicationError,
  BadRequestError,
  LambdaResponse,
  NotFoundError,
} from '@edusoftware/core/types';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

/**
 * Lambda function to retrieve a test entry by its string value.
 *
 * @param {APIGatewayProxyEventV2} event - The event object from AWS Lambda.
 * @returns {Promise<LambdaResponse<{ testString: string }>>}
 * @throws {BadRequestError} If the path parameter is missing.
 * @throws {NotFoundError} If no matching document is found.
 */
export const main = handler<{ testString: string }>(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<LambdaResponse<{ testString: string }>> => {
    await connectToDatabase();

    const testValue = event.pathParameters?.test;

    if (!testValue) {
      throw new BadRequestError('Test value must be provided');
    }

    try {
      const entryDoc = await TestEntry.findOne({ value: testValue });

      if (!entryDoc) {
        throw new NotFoundError(
          `Test entry with value "${testValue}" not found`,
        );
      }

      return {
        statusCode: 200,
        body: { testString: entryDoc.value },
      };
    } catch (error: unknown) {
      if (error instanceof ApplicationError) throw error;

      if (error instanceof Error) {
        console.error(`Failed to retrieve test entry: ${error.message}`);
        throw new ApplicationError(
          `Failed to retrieve test entry: ${error.message}`,
          500,
        );
      }

      console.error(
        `Unknown error occurred while fetching test entry: ${error}`,
      );
      throw new ApplicationError(
        'Failed to retrieve test entry due to unexpected error',
        500,
      );
    }
  },
);
