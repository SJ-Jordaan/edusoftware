import { z } from 'zod';
import { ObjectIdSchema, PopulatedQuestionSchema } from './Question';

export const LevelSchema = z.object({
  levelName: z.string(),
  description: z.string(),
  questionIds: z.array(ObjectIdSchema).optional(),
  updatedAt: z.string().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  track: z.enum(['AUTOMATA', 'REGEX']),
  isPractice: z.boolean(),
});

export const PopulatedLevelSchema = z.object({
  levelName: z.string(),
  description: z.string(),
  questionIds: z.array(PopulatedQuestionSchema).optional(),
  updatedAt: z.string().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  track: z.enum(['AUTOMATA', 'REGEX']),
  isPractice: z.boolean(),
});

export const UpdateLevelSchema = LevelSchema.partial();

// TypeScript type derived from the Zod schema
export type Level = z.infer<typeof LevelSchema>;
export type PopulatedLevel = z.infer<typeof PopulatedLevelSchema>;
export type IUpdateLevel = z.infer<typeof UpdateLevelSchema>;
export type PopulatedLevelObject = PopulatedLevel & { _id: string };
export type LevelObject = Level & { _id: string };

export interface GetLevelsQueryParams {
  isPractice?: boolean;
  track?: string;
}
