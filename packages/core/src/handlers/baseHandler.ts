import {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { ClientError } from '../types/Error';
import { LambdaResponse } from '../types/Response';

export const handler = <T>(
  lambda: (
    evt: APIGatewayProxyEvent,
    context: Context,
  ) => Promise<LambdaResponse<T>>,
) => {
  return async function (
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    try {
      const { statusCode, body, headers } = await lambda(event, context);

      // Default headers for CORS, can be overridden by lambda function
      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...headers,
      };

      return {
        statusCode,
        body: JSON.stringify(body),
        headers: defaultHeaders,
      };
    } catch (error) {
      console.error('Lambda execution error:', error); // Logging the error for monitoring or debugging

      // Differentiating between client-side (4xx) and server-side errors (5xx)
      const statusCode = error instanceof ClientError ? 400 : 500;

      return {
        statusCode,
        body: JSON.stringify({
          error:
            error instanceof Error ? error.message : 'Internal server error',
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    }
  };
};
