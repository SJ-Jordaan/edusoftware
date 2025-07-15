import { z } from 'zod';
import {
  LogictutorObjectIdSchema,
  LogictutorPopulatedQuestion,
  LogictutorPopulatedQuestionSchema,
} from './Question';

export const LogictutorLevelSchema = z.object({
  levelName: z.string(),
  description: z.string(),
  questionIds: z.array(LogictutorObjectIdSchema).optional(),
  updatedAt: z.string().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  timeLimit: z.number().optional(),
  enableToolbar: z.boolean(),
  showTruthTable: z.boolean(),
});

export const LogictutorPopulatedLevelSchema = z.object({
  levelName: z.string(),
  description: z.string(),
  questionIds: z.array(LogictutorPopulatedQuestionSchema).optional(),
  updatedAt: z.string().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  timeLimit: z.number().optional(),
  enableToolbar: z.boolean(),
  showTruthTable: z.boolean(),
});

export const LogictutorUpdateLevelSchema = LogictutorLevelSchema.partial();

// TypeScript type derived from the Zod schema
export type LogictutorLevel = z.infer<typeof LogictutorLevelSchema>;
export type LogictutorPopulatedLevel = z.infer<
  typeof LogictutorPopulatedLevelSchema
>;
export type LogictutorIUpdateLevel = z.infer<
  typeof LogictutorUpdateLevelSchema
>;
export type LogictutorPopulatedLevelObject = LogictutorPopulatedLevel & {
  _id: string;
};
export type LogictutorLevelObject = LogictutorLevel & { _id: string };

type QuestionWithoutId = Omit<LogictutorPopulatedQuestion, '_id'>;

export type LogictutorCreateLevelRequest = Omit<
  LogictutorPopulatedLevel,
  'questionIds' | '_id'
> & {
  questions: QuestionWithoutId[];
};

export type LogictutorFullLevel = LogictutorPopulatedLevelObject & {
  questions: LogictutorPopulatedQuestion[];
};
