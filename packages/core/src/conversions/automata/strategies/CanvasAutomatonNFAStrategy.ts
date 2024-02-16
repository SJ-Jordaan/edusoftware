import { NFA } from 'dfa-lib';
import { NonDeterministicFiniteAutomaton as NFAInterface } from '../../../types/NonDeterministicFiniteAutomaton';
import { NFAConversionStrategy } from './NFAConversionStrategy';
import {
  CanvasAutomaton,
  CanvasAutomatonSchema,
} from '../../../types/CanvasAutomaton';

/**
 * Strategy for converting a canvas automaton to an NFA.
 */
export class CanvasAutomatonNFAStrategy implements NFAConversionStrategy {
  /**
   * Converts a canvas automaton to an NFA.
   * @param automaton - The canvas automaton to convert.
   * @returns The constructed NFA.
   */
  convert(automaton: CanvasAutomaton): NFAInterface {
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
