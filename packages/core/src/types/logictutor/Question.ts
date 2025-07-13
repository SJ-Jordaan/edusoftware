import { z } from 'zod';
export const LogictutorObjectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const LogictutorQuestionSchema = z.object({
  questionContent: z.string().min(1, 'Question content is required'),
  answer: z.string().min(1, 'Answer is required'),
  hints: z.array(z.string()).optional(),
  score: z.number().default(0),
  booleanExpression: z.string().min(1, 'Boolean Expression is required'),
});

export const LogictutorUpdateQuestionSchema =
  LogictutorQuestionSchema.partial();
export const LogictutorPopulatedQuestionSchema =
  LogictutorQuestionSchema.extend({
    _id: LogictutorObjectIdSchema,
  });

// TypeScript type derived from the Zod schema
export type LogictutorQuestion = z.infer<typeof LogictutorQuestionSchema>;
export type LogictutorQuestionObject = LogictutorQuestion & { _id: string };
export type LogictutorUpdateQuestion = z.infer<
  typeof LogictutorUpdateQuestionSchema
>;
export type LogictutorPopulatedQuestion = z.infer<
  typeof LogictutorPopulatedQuestionSchema
>;
