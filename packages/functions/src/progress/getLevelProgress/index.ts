import {
  Progress,
  Level,
  connectToDatabase,
  IPopulatedLevelDoc,
  IProgressDocumentPopulated,
} from '@edusoftware/core/databases';
import { handler } from '@edusoftware/core/handlers';
import {
  ApplicationError,
  LambdaResponse,
  NotFoundError,
  BadRequestError,
  GetLevelProgressResponse,
} from '@edusoftware/core/types';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { useSessionWithRoles } from '@edusoftware/core/handlers';
import { calculateTimeRemaining } from './helpers/time';
import { completeLevel } from '../submitAnswer/helpers';

export const main = handler<GetLevelProgressResponse>(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<LambdaResponse<GetLevelProgressResponse>> => {
    await connectToDatabase();
    const levelId = event.pathParameters?.id;

    if (!levelId) {
      throw new BadRequestError('Level ID must be provided');
    }

    try {
      const { userId: userId } = await useSessionWithRoles();

      const [levelDoc, progress] = await Promise.all([
        Level.findById(levelId).populate(
          'questionIds',
        ) as Promise<IPopulatedLevelDoc>,
        Progress.find({ userId, levelId }).populate(
          'questionsAttempted.questionId',
        ) as Promise<IProgressDocumentPopulated[]>,
      ]);

      if (!levelDoc) {
        throw new NotFoundError(`Level with ID ${levelId}`);
      }

      if (!progress || progress.length === 0) {
        throw new NotFoundError(`Progress for level ID ${levelId}`);
      }

      const levelProgress = progress[0];

      if (levelProgress.completedAt) {
        return {
          statusCode: 200,
          body: {
            isCompleted: true,
            isPractice: levelDoc.isPractice,
          },
        };
      }

      const maxTime = 60 * 10;
      const timeRemaining = calculateTimeRemaining(levelProgress, maxTime);

      if (timeRemaining <= 1) {
        await completeLevel(
          levelProgress,
          userId,
          levelId,
          levelDoc.isPractice,
        );

        return {
          statusCode: 200,
          body: {
            isCompleted: true,
            isPractice: levelDoc.isPractice,
          },
        };
      }

      const nextQuestion = levelDoc.questionIds.find(
        (question) =>
          !levelProgress.questionsAttempted.some((attempt) => {
            if (!attempt.questionId) {
              return false;
            }

            return (
              attempt.questionId._id.toString() === question._id.toString() &&
              attempt.correct
            );
          }),
      );

      if (!nextQuestion) {
        return {
          statusCode: 200,
          body: {
            question: levelDoc.questionIds[0].toObject(),
            isCompleted: false,
            isPractice: levelDoc.isPractice,
          },
        };
      }

      return {
        statusCode: 200,
        body: {
          question: nextQuestion.toObject(),
          timeRemaining,
          isCompleted: false,
          isPractice: levelDoc.isPractice,
        },
      };
    } catch (error: unknown) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      if (error instanceof Error) {
        console.error(`Failed to fetch data: ${error.message}`);
        throw new ApplicationError(
          `Failed to fetch data: ${error.message}`,
          500,
        );
      }

      console.error(`Failed to fetch data: ${error}`);
      throw new ApplicationError(
        'Failed to fetch data due to unexpected error',
        500,
      );
    }
  },
);
