import { NFA } from 'dfa-lib';
import { NFAConversionStrategy } from './NFAConversionStrategy';
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

/**
 * Strategy for converting a canvas automaton to an NFA.
 */
export class CanvasAutomatonNFAStrategy implements NFAConversionStrategy {
  /**
   * Converts a canvas automaton to an NFA.
   * @param automaton - The canvas automaton to convert.
   * @returns The constructed NFA.
   */
  convert(automaton: CanvasAutomaton) {
    // Validate the automaton input
    const parsedAutomaton = CanvasAutomatonSchema.safeParse(automaton);
    if (!parsedAutomaton.success) {
      throw new Error('Invalid canvas automaton format');
    }
    const { alphabet, states, transitions, initial, finals } =
      parsedAutomaton.data;

    const delta: { [key: string]: { [symbol: string]: string[] } } = {};
    states.forEach((state) => {
      delta[state] = {};
    });

    transitions.forEach((transition) => {
      if (transition.label === '') {
        return;
      }

      if (!(transition.label in delta[transition.from])) {
        delta[transition.from][transition.label] = [];
      }

      if (transition.to) {
        delta[transition.from][transition.label].push(transition.to);
      }
    });

    return new NFA(alphabet, delta, [initial], finals);
  }
}
