import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { handler } from '@edusoftware/core/handlers';
import { BadRequestError, LambdaResponse } from '@edusoftware/core/types';
import {
  LogictutorLevelModel,
  LogictutorQuestionModel,
} from '@edusoftware/core/databases/logictutor';
import { connectToDatabase } from '@edusoftware/core/databases';
import {
  LogictutorCreateLevelRequest,
  LogictutorLevelSchema,
  LogictutorPopulatedLevel,
  LogictutorQuestionSchema,
} from '@edusoftware/core/types/logictutor';

export const main = handler<LogictutorPopulatedLevel>(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<LambdaResponse<LogictutorPopulatedLevel>> => {
    if (!event.body) {
      throw new BadRequestError('Request body is required');
    }

    let parsedData: LogictutorCreateLevelRequest;
    try {
      parsedData = JSON.parse(event.body);
    } catch {
      throw new BadRequestError('Invalid JSON');
    }

    // Validate level fields (excluding questions)
    try {
      LogictutorLevelSchema.pick({
        levelName: true,
        description: true,
        difficulty: true,
        updatedAt: true,
      }).parse(parsedData);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Invalid level data';
      throw new BadRequestError(message);
    }

    // Validate each question
    parsedData.questions.forEach((q, idx) => {
      try {
        LogictutorQuestionSchema.parse(q);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? `Question ${idx + 1}: ${error.message}`
            : `Invalid question at index ${idx}`;
        throw new BadRequestError(message);
      }
    });

    await connectToDatabase();

    try {
      // Insert questions
      const questionDocs = await LogictutorQuestionModel.insertMany(
        parsedData.questions,
      );

      // Create the level
      const levelDoc = await LogictutorLevelModel.create([
        {
          levelName: parsedData.levelName,
          description: parsedData.description,
          difficulty: parsedData.difficulty,
          updatedAt: parsedData.updatedAt ?? new Date().toISOString(),
          questionIds: questionDocs.map((q) => q._id),
        },
      ]);

      return {
        statusCode: 201,
        body: {
          levelName: levelDoc[0].levelName,
          description: levelDoc[0].description,
          difficulty: levelDoc[0].difficulty,
          updatedAt: levelDoc[0].updatedAt,
          questionIds: questionDocs.map((q) => ({
            _id: q._id.toString(),
            questionContent: q.questionContent,
            answer: q.answer,
            hints: q.hints,
            score: q.score,
            booleanExpression: q.booleanExpression,
            outputSymbol: q.outputSymbol,
          })),
        },
      };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unknown error while creating level';
      throw new BadRequestError(message);
    }
  },
);
