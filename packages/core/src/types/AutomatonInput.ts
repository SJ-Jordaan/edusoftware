import { RegexSchema } from './RegexInput';
import { z } from 'zod';
import { CanvasAutomatonSchema } from './CanvasAutomaton';
import { GridAutomatonSchema } from './GridAutomaton';

/**
 * Zod schema for validating automaton input, which can be a raw string (e.g., for regular expressions),
 * a grid automaton structure, or a canvas automaton structure.
 */
export const AutomatonInputSchema = z.union([
  RegexSchema,
  GridAutomatonSchema,
  CanvasAutomatonSchema,
]);

/**
 * Type derived from the AutomatonInputSchema Zod schema. It represents the possible types of automaton inputs:
 * either a string, a GridAutomaton, or a CanvasAutomaton.
 */
export type AutomatonInput = z.infer<typeof AutomatonInputSchema>;
