import { z } from 'zod';
export const LogictutorObjectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const LogictutorQuestionSchema = z.object({
  questionContent: z.string().min(1, 'Question content is required'),
  hints: z.array(z.string()).optional(),
  booleanExpression: z.string().min(1, 'Boolean Expression is required'),
  outputSymbol: z.string().max(1, 'Output Symbol is required'),
  enableToolbar: z.boolean(),
  showTruthTable: z.boolean(),
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
