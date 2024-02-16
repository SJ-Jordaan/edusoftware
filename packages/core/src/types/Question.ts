import { z } from 'zod';

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
  hints: z.array(z.string()),
  score: z.number().default(0),
  alphabet: z.string(),
  operators: z.array(z.string()),
});

// TypeScript type derived from the Zod schema
export type QuestionType = z.infer<typeof QuestionTypeSchema>;
export type Question = z.infer<typeof QuestionSchema>;
