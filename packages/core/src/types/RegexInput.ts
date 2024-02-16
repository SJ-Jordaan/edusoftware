import { z } from 'zod';

export const RegexSchema = z.string();

/**
 * Validates the inputs for the regex conversion strategy using zod.
 */
export const RegexInputSchema = z.object({
  regex: RegexSchema,
  alphabet: z.string(),
});

export const RegexStringSchema = z.string();

/**
 * Type derived from the RegexInputSchema Zod schema. It represents the possible types of regex inputs.
 */
export type Regex = z.infer<typeof RegexSchema>;
export type RegexInput = z.infer<typeof RegexInputSchema>;
export type RegexString = z.infer<typeof RegexStringSchema>;
