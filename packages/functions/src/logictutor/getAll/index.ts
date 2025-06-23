import { connectToDatabase, TestEntry } from '@edusoftware/core/databases';
import { handler } from '@edusoftware/core/handlers';
import { ApplicationError, LambdaResponse } from '@edusoftware/core/types';
/**
 * Lambda function to retrieve all test entries.
 *
 * @param {APIGatewayProxyEventV2} event - The event object from AWS Lambda.
 * @returns {Promise<LambdaResponse<{ testString: string }[]>>}
 */
export const main = handler<{ testString: string }[]>(
  async (): Promise<LambdaResponse<{ testString: string }[]>> => {
    await connectToDatabase();

    try {
      const entries = await TestEntry.find();

      const result = entries.map((entry) => ({
        testString: entry.value,
      }));

      return {
        statusCode: 200,
        body: result,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Failed to fetch test entries: ${error.message}`);
        throw new ApplicationError(
          `Failed to fetch test entries: ${error.message}`,
          500,
        );
      }

      console.error(
        `Unknown error occurred while fetching test entries: ${error}`,
      );
      throw new ApplicationError(
        'Failed to fetch test entries due to unexpected error',
        500,
      );
    }
  },
);
