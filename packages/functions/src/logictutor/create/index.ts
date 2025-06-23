import { TestCreate, TestSchema } from '@edusoftware/core/types';
import { connectToDatabase, TestEntry } from '@edusoftware/core/databases';
import { handler } from '@edusoftware/core/handlers';
import { BadRequestError, LambdaResponse } from '@edusoftware/core/types';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

export const main = handler<TestCreate>(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<LambdaResponse<TestCreate>> => {
    if (!event.body) {
      throw new BadRequestError('Request body is required');
    }

    let parsedData: TestCreate;
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
    const doc = await TestEntry.create({ value: testString });

    return {
      statusCode: 201,
      body: { testString: doc.value },
    };
  },
);
