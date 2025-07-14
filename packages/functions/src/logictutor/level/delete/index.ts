import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { handler } from '@edusoftware/core/handlers';
import {
  BadRequestError,
  LambdaResponse,
  ApplicationError,
} from '@edusoftware/core/types';
import {
  LogictutorLevelModel,
  LogictutorQuestionModel,
} from '@edusoftware/core/databases/logictutor';
import { connectToDatabase } from '@edusoftware/core/databases';

export const main = handler<{ message: string }>(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<LambdaResponse<{ message: string }>> => {
    const levelId = event.queryStringParameters?.levelId;

    if (!levelId) {
      throw new BadRequestError('Missing levelId parameter');
    }

    await connectToDatabase();

    try {
      const level = await LogictutorLevelModel.findByIdAndDelete(levelId);

      if (!level) {
        throw new BadRequestError(`Level with ID ${levelId} not found`);
      }

      // Delete associated questions if there are any
      if (level.questionIds && level.questionIds.length > 0) {
        await LogictutorQuestionModel.deleteMany({
          _id: { $in: level.questionIds },
        });
      }

      return {
        statusCode: 200,
        body: {
          message: `Level ${levelId} and its associated questions deleted successfully`,
        },
      };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unknown error while deleting level';
      throw new ApplicationError(message, 500);
    }
  },
);
