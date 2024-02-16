import { z } from 'zod';

/**
 * Schema for a state in a canvas automaton.
 */
export const CanvasAutomatonStateSchema = z.string(); // Assuming states are identified by string IDs.

/**
 * Schema for a transition in a canvas automaton.
 */
export const CanvasAutomatonTransitionSchema = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string(), // Transition symbol
});

/**
 * Schema for the entire canvas automaton.
 */
export const CanvasAutomatonSchema = z.object({
  states: z.array(CanvasAutomatonStateSchema),
  transitions: z.array(CanvasAutomatonTransitionSchema),
  initial: z.string(),
  finals: z.array(z.string()),
  alphabet: z.array(z.string()),
});

export type CanvasAutomatonState = z.infer<typeof CanvasAutomatonStateSchema>;
export type CanvasAutomatonTransition = z.infer<
  typeof CanvasAutomatonTransitionSchema
>;
export type CanvasAutomaton = z.infer<typeof CanvasAutomatonSchema>;
