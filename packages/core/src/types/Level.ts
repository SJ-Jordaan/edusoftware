import { z } from 'zod';
import { QuestionSchema } from './Question';

const ObjectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const LevelSchema = z.object({
  levelName: z.string(),
  description: z.string(),
  questionIds: z.array(ObjectIdSchema).optional(),
  startDate: z.string(),
  endDate: z.string(),
});

export const PopulatedLevelSchema = z.object({
  levelName: z.string(),
  description: z.string(),
  questionIds: z.array(QuestionSchema).optional(),
  startDate: z.string(),
  endDate: z.string(),
});

// TypeScript type derived from the Zod schema
export type Level = z.infer<typeof LevelSchema>;
export type PopulatedLevel = z.infer<typeof PopulatedLevelSchema>;
