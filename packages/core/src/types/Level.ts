import { z } from 'zod';
import { ObjectIdSchema, PopulatedQuestionSchema } from './Question';

export const LevelSchema = z.object({
  levelName: z.string(),
  description: z.string(),
  questionIds: z.array(ObjectIdSchema).optional(),
  startDate: z.string(),
  endDate: z.string(),
  organisation: z.string(),
  updatedAt: z.string().optional(),
});

export const PopulatedLevelSchema = z.object({
  levelName: z.string(),
  description: z.string(),
  questionIds: z.array(PopulatedQuestionSchema).optional(),
  startDate: z.string(),
  endDate: z.string(),
  organisation: z.string(),
  updatedAt: z.string().optional(),
});

export const UpdateLevelSchema = LevelSchema.partial();

// TypeScript type derived from the Zod schema
export type Level = z.infer<typeof LevelSchema>;
export type PopulatedLevel = z.infer<typeof PopulatedLevelSchema>;
export type IUpdateLevel = z.infer<typeof UpdateLevelSchema>;
export type PopulatedLevelObject = PopulatedLevel & { _id: string };
export type LevelObject = Level & { _id: string };
