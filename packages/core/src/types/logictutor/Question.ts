import { z } from 'zod';
export const ObjectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const QuestionSchema = z.object({
  questionContent: z.string().min(1, 'Question content is required'),
  answer: z.string().min(1, 'Answer is required'),
  hints: z.array(z.string()).optional(),
  score: z.number().default(0),
  booleanExpression: z.string().min(1, 'Boolean Expression is required'),
});

export const UpdateQuestionSchema = QuestionSchema.partial();
export const PopulatedQuestionSchema = QuestionSchema.extend({
  _id: ObjectIdSchema,
});

// TypeScript type derived from the Zod schema
export type Question = z.infer<typeof QuestionSchema>;
export type QuestionObject = Question & { _id: string };
export type UpdateQuestion = z.infer<typeof UpdateQuestionSchema>;
export type PopulatedQuestion = z.infer<typeof PopulatedQuestionSchema>;
