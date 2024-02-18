import { ApiHandler } from 'sst/node/api';
import {
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyEventV2,
} from 'aws-lambda';
import { ApplicationError, LambdaResponse } from '../types';

export const handler = <T>(
  lambda: (
    evt: APIGatewayProxyEventV2,
    context: Context,
  ) => Promise<LambdaResponse<T>>,
) => {
  return ApiHandler(async function (
    event: APIGatewayProxyEventV2,
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
      console.error('Lambda execution error:', error); // Logging the error

      // Check if the error is an instance of ApplicationError or its subclasses
      if (error instanceof ApplicationError) {
        return {
          statusCode: error.statusCode,
          body: JSON.stringify({ error: error.message }),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Consider more restrictive settings for production
          },
        };
      } else {
        // Handle unexpected errors
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Internal server error' }),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        };
      }
    }
  });
};
