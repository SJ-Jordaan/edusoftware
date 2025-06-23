import { z } from 'zod';

export const TestSchema = z.object({
  testString: z.string(),
});
export const TestUpdateSchema = z.object({
  testString: z.string(),
  oldString: z.string(),
});

// TypeScript type derived from the Zod schema
export type TestCreate = z.infer<typeof TestSchema>;
export type TestDelete = z.infer<typeof TestSchema>;
export type TestUpdate = z.infer<typeof TestUpdateSchema>;
