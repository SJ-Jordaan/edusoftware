import { TestDelete, TestSchema } from '@edusoftware/core/types';
import { connectToDatabase, TestEntry } from '@edusoftware/core/databases';
import { handler } from '@edusoftware/core/handlers';
import { BadRequestError, LambdaResponse } from '@edusoftware/core/types';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

export const main = handler<TestDelete>(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<LambdaResponse<TestDelete>> => {
    if (!event.body) {
      throw new BadRequestError('Request body is required');
    }

    let parsedData: TestDelete;
    try {
      parsedData = TestSchema.parse(JSON.parse(event.body));
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Invalid test data and could not parse error details';
      throw new BadRequestError(message);
    }

    await connectToDatabase();

    const { testString } = parsedData;
    await TestEntry.deleteOne({ value: testString });

    return {
      statusCode: 201,
      body: { testString: testString },
    };
  },
);
