import { isAnswerCorrect } from './../../../../core/src/evaluation/helpers/isAnswerCorrect';
import { handler, useSessionWithRoles } from '@edusoftware/core/handlers';
import {
  AnswerEvaluation,
  ApplicationError,
  BadRequestError,
  LambdaResponse,
  NotFoundError,
} from '@edusoftware/core/types';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import {
  completeLevel,
  hasExceededTimeLimit,
  fetchCurrentQuestionProgress,
  isLevelCompleted,
} from './helpers';
import { updateProgress } from './helpers/updateProgress';
import { connectToDatabase } from '@edusoftware/core/databases';

export const main = handler<AnswerEvaluation>(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<LambdaResponse<AnswerEvaluation>> => {
    if (
      !event.body ||
      !event.pathParameters?.questionId ||
      !event.pathParameters?.levelId
    ) {
      throw new BadRequestError(
        'Missing either questionId, levelId, or request body',
      );
    }
    const { answer } = JSON.parse(event.body);
    const { questionId, levelId } = event.pathParameters;

    try {
      await connectToDatabase();
      const { userId: userId } = await useSessionWithRoles();
      const currentProgress = await fetchCurrentQuestionProgress(
        userId,
        levelId,
        questionId,
      );

      if (currentProgress === null) {
        throw new NotFoundError('Question progress');
      }

      const { levelDoc, questionDoc, levelProgress, questionProgress } =
        currentProgress;

      const question = questionDoc.toObject();

      const finishLevel = hasExceededTimeLimit(levelProgress.startedAt!);

      if (!questionProgress) {
        if (finishLevel) {
          await completeLevel(
            levelProgress,
            userId,
            levelId,
            levelDoc.isPractice,
          );

          return {
            statusCode: 200,
            body: {
              isCorrect: false,
              isCompleted: true,
              message: 'Time limit reached. Level completed.',
            },
          };
        }

        const { correct: isCorrect, message } = isAnswerCorrect(
          question,
          answer,
        );

        updateProgress(levelProgress, null, isCorrect, question);

        if (isLevelCompleted(levelDoc, levelProgress)) {
          await completeLevel(
            levelProgress,
            userId,
            levelId,
            levelDoc.isPractice,
          );

          return {
            statusCode: 200,
            body: {
              isCorrect,
              isCompleted: true,
              message: 'All questions solved. Level Complete.',
            },
          };
        }

        await levelProgress.save();

        return {
          statusCode: 200,
          body: {
            isCorrect,
            isCompleted: false,
            message: message ?? 'Answer submitted successfully',
          },
        };
      }

      if (questionProgress.correct) {
        return {
          statusCode: 200,
          body: {
            isCorrect: true,
            isCompleted: levelProgress.completedAt !== null,
            message: 'Question already solved.',
          },
        };
      }

      if (finishLevel) {
        await completeLevel(
          levelProgress,
          userId,
          levelId,
          levelDoc.isPractice,
        );

        return {
          statusCode: 200,
          body: {
            isCorrect: false,
            isCompleted: true,
            message: 'Time limit reached. Level completed.',
          },
        };
      }

      const { correct: isCorrect, message } = isAnswerCorrect(question, answer);

      updateProgress(levelProgress, questionProgress, isCorrect, question);

      if (isLevelCompleted(levelDoc, levelProgress)) {
        await completeLevel(
          levelProgress,
          userId,
          levelId,
          levelDoc.isPractice,
        );

        return {
          statusCode: 200,
          body: {
            isCorrect,
            isCompleted: true,
            message: 'All questions solved. Level Complete.',
          },
        };
      }

      await levelProgress.save();

      return {
        statusCode: 200,
        body: {
          isCorrect,
          isCompleted: false,
          message: message ?? 'Answer submitted successfully',
        },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Failed to submit answer: ${error.message}`);
        throw new ApplicationError(
          `Failed to submit answer: ${error.message}`,
          500,
        );
      }

      if (error instanceof ApplicationError) {
        throw error;
      }

      console.error(`Failed to submit answer: ${error}`);
      throw new ApplicationError(
        'Failed to submit answer due to unexpected error',
        500,
      );
    }
  },
);
