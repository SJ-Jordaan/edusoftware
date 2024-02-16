import { handler } from '@edusoftware/core/handlers';
import { LambdaResponse } from '@edusoftware/core/types';

export const main = handler<string>(
  async (): Promise<LambdaResponse<string>> => {
    return { statusCode: 200, body: 'Hello, world!' };
  },
);
