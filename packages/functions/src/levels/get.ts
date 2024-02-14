import { connectToDatabase } from '@edusoftware/core/mongo';
import handler from '@edusoftware/core/handler';
import Level from '@edusoftware/core/models/Level';

export const main = handler(async () => {
  await connectToDatabase();
  const levels = await Level.find({}).populate('questionIds');
  return JSON.stringify(levels);
});