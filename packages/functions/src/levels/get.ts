import { connectToDatabase } from '@edusoftware/core/databases';
import { handler } from '@edusoftware/core/handlers';
import { Level } from '@edusoftware/core/databases/models';

export const main = handler(async () => {
  await connectToDatabase();
  const levels = await Level.find({}).populate('questionIds');
  return JSON.stringify(levels);
});
