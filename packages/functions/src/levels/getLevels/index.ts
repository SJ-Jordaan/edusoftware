import { connectToDatabase, Level } from '@edusoftware/core/databases';
import { handler } from '@edusoftware/core/handlers';
import { LambdaResponse, PopulatedLevel } from '@edusoftware/core/types';

export const main = handler<PopulatedLevel[]>(
  async (): Promise<LambdaResponse<PopulatedLevel[]>> => {
    await connectToDatabase();
    const levels: PopulatedLevel[] = await Level.find({}).populate(
      'questionIds',
    );
    return {
      statusCode: 200,
      body: levels,
    };
  },
);
