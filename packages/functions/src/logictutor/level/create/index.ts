import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { handler } from '@edusoftware/core/handlers';
import { BadRequestError, LambdaResponse } from '@edusoftware/core/types';
import {
  LogictutorLevelModel,
  LogictutorQuestionModel,
} from '@edusoftware/core/databases/logictutor';
import { connectToDatabase } from '@edusoftware/core/databases';
import {
  LevelSchema,
  PopulatedLevel,
  PopulatedQuestion,
  QuestionSchema,
} from '@edusoftware/core/types/logictutor';
import mongoose from 'mongoose';

type QuestionWithoutId = Omit<PopulatedQuestion, '_id'>;

interface CreateLevelRequest
  extends Omit<PopulatedLevel, 'questionIds' | '_id'> {
  questions: QuestionWithoutId[];
}

export const main = handler<PopulatedLevel>(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<LambdaResponse<PopulatedLevel>> => {
    if (!event.body) {
      throw new BadRequestError('Request body is required');
    }

    let parsedData: CreateLevelRequest;
    try {
      parsedData = JSON.parse(event.body);
    } catch {
      throw new BadRequestError('Invalid JSON');
    }

    // Validate level fields (excluding questions)
    try {
      LevelSchema.pick({
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
        QuestionSchema.parse(q);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? `Question ${idx + 1}: ${error.message}`
            : `Invalid question at index ${idx}`;
        throw new BadRequestError(message);
      }
    });

    if (parsedData.questions.length !== 5) {
      throw new BadRequestError('Exactly 5 questions are required');
    }

    await connectToDatabase();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Insert questions
      const questionDocs = await LogictutorQuestionModel.insertMany(
        parsedData.questions,
        {
          session,
        },
      );

      // Create the level
      const levelDoc = await LogictutorLevelModel.create(
        [
          {
            levelName: parsedData.levelName,
            description: parsedData.description,
            difficulty: parsedData.difficulty,
            updatedAt: parsedData.updatedAt ?? new Date().toISOString(),
            questionIds: questionDocs.map((q) => q._id),
          },
        ],
        { session },
      );

      await session.commitTransaction();
      session.endSession();

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
          })),
        },
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      const message =
        err instanceof Error
          ? err.message
          : 'Unknown error while creating level';
      throw new BadRequestError(message);
    }
  },
);
