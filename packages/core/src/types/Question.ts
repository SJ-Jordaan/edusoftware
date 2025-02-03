import { z } from 'zod';
export const ObjectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');
export const QuestionTypeSchema = z.enum([
  'Construct Automaton',
  'Construct Automaton Missing Symbols',
  'Regex',
  'Regex Equivalence',
  'Regex Accepts String',
  'Automaton to Regex',
]);

export const QuestionSchema = z.object({
  questionType: QuestionTypeSchema,
  questionContent: z.string(),
  answer: z.string(),
  hints: z.array(z.string()).optional(),
  score: z.number().default(0),
  alphabet: z.string(),
  operators: z.array(z.string()).optional(),
});

export const UpdateQuestionSchema = QuestionSchema.partial();
export const PopulatedQuestionSchema = QuestionSchema.extend({
  _id: ObjectIdSchema,
});

// TypeScript type derived from the Zod schema
export type QuestionType = z.infer<typeof QuestionTypeSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type QuestionObject = Question & { _id: string };
export type UpdateQuestion = z.infer<typeof UpdateQuestionSchema>;
export type PopulatedQuestion = z.infer<typeof PopulatedQuestionSchema>;
