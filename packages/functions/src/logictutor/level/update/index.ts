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

    if (existingQuestionIds && existingQuestionIds.length > 0) {
      await LogictutorQuestionModel.deleteMany({
        _id: { $in: existingQuestionIds },
      });
    }

    // Upsert questions with better error handling
    const updatedQuestionIds = [];

    for (const q of parsedData.questions) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...questionData } = q;
      LogictutorQuestionSchema.parse(questionData);
      const newQuestion = await LogictutorQuestionModel.create(q);
      updatedQuestionIds.push(newQuestion._id.toString());
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
