import { NFA } from '../../../automata/dfa-lib';
import { AutomatonInput } from '../../../types/AutomatonInput';

/**
 * Interface for strategies converting different types of automaton inputs into NFAs.
 */
export interface NFAConversionStrategy {
  /**
   * Converts an automaton input into an NFA.
   * @param automaton - The automaton to convert, which can be of various types.
   * @param alphabet - The alphabet used in the conversion, applicable in certain contexts.
   * @returns An NFA instance representing the automaton.
   * @throws Will throw an error if the conversion cannot be completed.
   */
  convert(automaton: AutomatonInput, alphabet: string): NFA;
}
