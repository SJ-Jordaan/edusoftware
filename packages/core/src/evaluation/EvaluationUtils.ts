import { NFA } from '../types/NFA';

import { AutomatonConverter, StandardAlphabetStrategy } from '../conversions';

/**
 * Utility class for common operations used in evaluation strategies.
 */
export class EvaluationUtils {
  /**
   * Normalizes and parses the given answer using a specified alphabet.
   * @param {string} answer - The answer to normalize and parse.
   * @param {string[]} alphabet - The alphabet to use for normalization.
   * @returns The result of the conversion.
   */
  static normalizeAndParse(answer: string, alphabet: string[]) {
    const automatonConverter = new AutomatonConverter(
      answer,
      alphabet.join(''),
    );
    return automatonConverter.convert();
  }

  /**
   * Performs a union operation on two lists, removing duplicates and sorting the result.
   * @param {Array} l1 - The first list.
   * @param {Array} l2 - The second list.
   * @returns {Array} A sorted array containing the union of l1 and l2 without duplicates.
   */
  static union(l1: string[] | string, l2: string[] | string): string[] {
    return [...new Set([...l1, ...l2])].sort();
  }

  /**
   * Finds equivalence counterexamples between two minimized NFAs.
   * @param {NFA} m1 - The first NFA.
   * @param {NFA} m2 - The second NFA.
   * @returns {[string | null, string | null]} A pair of strings indicating incorrect reject and accept counterexamples, if any.
   */
  static findEquivalenceCounterexamples(
    m1: NFA,
    m2: NFA,
  ): [string | null, string | null] {
    const alphabetStrategy = new StandardAlphabetStrategy();

    const unifiedAlphabet = this.union(
      alphabetStrategy.normalise(m1.alphabet),
      alphabetStrategy.normalise(m2.alphabet),
    );

    m1.alphabet = m2.alphabet = unifiedAlphabet;

    const minimalDFA1 = m1.minimized();
    const minimalDFA2 = m2.minimized();

    return minimalDFA1.find_equivalence_counterexamples(minimalDFA2);
  }
}
