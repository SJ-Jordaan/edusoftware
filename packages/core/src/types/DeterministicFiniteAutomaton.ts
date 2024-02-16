import { NonDeterministicFiniteAutomaton } from './NonDeterministicFiniteAutomaton';

export interface DeterministicFiniteAutomaton {
  // Properties
  alphabet: string[];
  states: string[];
  delta: { [state: string]: { [symbol: string]: string } };
  initial: string;
  final: string[];
  isMinimized: boolean;

  // Methods
  /**
   * Determines if the DFA accepts a given string.
   * @param str The string to check against the DFA.
   * @returns `true` if the string is accepted, `false` otherwise.
   */
  accepts(str: string): boolean;

  /**
   * Converts the DFA to an equivalent NFA.
   * @returns An NFA equivalent to this DFA.
   */
  to_NFA(): NonDeterministicFiniteAutomaton;

  /**
   * Minimizes the DFA to its smallest equivalent DFA.
   * @returns A new DFA instance that is the minimized version of this DFA.
   */
  minimized(): DeterministicFiniteAutomaton;

  /**
   * Produces a new DFA without unreachable states.
   * @returns A new DFA instance equivalent to this one but without unreachable states.
   */
  without_unreachables(): DeterministicFiniteAutomaton;

  /**
   * Complements the DFA, producing a new DFA that accepts exactly the strings this DFA does not.
   * @returns A new DFA instance that is the complement of this DFA.
   */
  complemented(): DeterministicFiniteAutomaton;

  /**
   * Finds one of the shortest strings accepted by the DFA, if such exists.
   * @returns A string accepted by the DFA, or `null` if no such string exists.
   */
  find_passing(): string | null;

  /**
   * Intersects this DFA with another, producing a new DFA for the intersection of their languages.
   * @param other The other DFA to intersect with.
   * @returns A new DFA instance representing the intersection of this DFA's and the other DFA's languages.
   */
  intersect(other: DeterministicFiniteAutomaton): DeterministicFiniteAutomaton;

  /**
   * Finds counterexamples to equivalence between this DFA and another.
   * @param other The DFA to compare with for equivalence.
   * @returns A pair of strings, where the first string is accepted by this DFA but not by `other`,
   * and the second string is accepted by `other` but not by this DFA. If the DFAs are equivalent,
   * returns [null, null].
   */
  find_equivalence_counterexamples(
    other: DeterministicFiniteAutomaton,
  ): [string | null, string | null];

  /**
   * Generates a string representation of the DFA in Dot graph format.
   * @returns A string representing the DFA in Dot format.
   */
  dottified(): string;

  /**
   * Serializes the DFA to a JSON string representation, discarding state names and unreachable states.
   * @returns A string representing a JSON serialization of the DFA.
   */
  serialized(): string;
}
