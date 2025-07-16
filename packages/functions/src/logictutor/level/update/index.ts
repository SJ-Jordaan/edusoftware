import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { handler } from '@edusoftware/core/handlers';
import { BadRequestError, LambdaResponse } from '@edusoftware/core/types';
import {
  LogictutorLevelModel,
  LogictutorQuestionModel,
} from '@edusoftware/core/databases/logictutor';
import { connectToDatabase } from '@edusoftware/core/databases';
import {
  LogictutorUpdateLevelRequest,
  LogictutorLevelSchema,
  LogictutorQuestionSchema,
} from '@edusoftware/core/types/logictutor';

export const main = handler<string>(
  async (event: APIGatewayProxyEventV2): Promise<LambdaResponse<string>> => {
    if (!event.body) {
      throw new BadRequestError('Request body is required');
    }

    let parsedData: LogictutorUpdateLevelRequest;
    try {
      parsedData = JSON.parse(event.body);
    } catch {
      throw new BadRequestError('Invalid JSON');
    }

    await connectToDatabase();

    const existingLevel = await LogictutorLevelModel.findById(parsedData._id);
    if (!existingLevel) {
      throw new BadRequestError('Level not found');
    }

    // Validate level fields (excluding questions)
    try {
      LogictutorLevelSchema.pick({
        levelName: true,
        description: true,
        difficulty: true,
        updatedAt: true,
        timeLimit: true,
      }).parse(parsedData);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Invalid level data';
      throw new BadRequestError(message);
    }

    // Extract IDs for comparison
    const existingQuestionIds = existingLevel.questionIds?.map((id) =>
      id.toString(),
    );
    const submittedIds = parsedData.questions
      .filter((q) => q._id)
      .map((q) => q._id!);

    // Find and delete removed questions
    const removedIds = existingQuestionIds?.filter(
      (id) => !submittedIds.includes(id),
    );
    if (removedIds && removedIds.length > 0) {
      await LogictutorQuestionModel.deleteMany({ _id: { $in: removedIds } });
    }

    // Upsert questions with better error handling
    const updatedQuestionIds = [];

    for (const q of parsedData.questions) {
      try {
        if (q._id) {
          // For updates, validate the question data
          // Remove _id from validation as it's not part of the schema
          const { _id, ...questionData } = q;

          try {
            LogictutorQuestionSchema.parse(questionData);
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : 'Invalid question data';
            throw new BadRequestError(
              `Question validation failed for ID ${_id}: ${message}`,
            );
          }

          // Update existing question
          const updatedQuestion =
            await LogictutorQuestionModel.findByIdAndUpdate(_id, questionData, {
              new: true,
              runValidators: true, // This ensures mongoose validators run
            });

          if (!updatedQuestion) {
            throw new BadRequestError(
              `Question with ID ${_id} not found for update`,
            );
          }

          updatedQuestionIds.push(_id);
        } else {
          // For new questions, validate the entire object
          try {
            LogictutorQuestionSchema.parse(q);
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : 'Invalid question data';
            throw new BadRequestError(
              `New question validation failed: ${message}`,
            );
          }

          const newQuestion = await LogictutorQuestionModel.create(q);
          updatedQuestionIds.push(newQuestion._id);
        }
      } catch (error) {
        // Re-throw BadRequestError, wrap others
        if (error instanceof BadRequestError) {
          throw error;
        }
        throw new BadRequestError(
          `Failed to process question: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    // Update level fields
    existingLevel.levelName = parsedData.levelName;
    existingLevel.description = parsedData.description;
    existingLevel.difficulty = parsedData.difficulty;
    existingLevel.timeLimit = parsedData.timeLimit ?? undefined;
    existingLevel.updatedAt = parsedData.updatedAt ?? new Date().toISOString();
    existingLevel.questionIds = updatedQuestionIds;

    await existingLevel.save();

    return {
      statusCode: 200,
      body: 'Level updated successfully',
    };
  },
);
