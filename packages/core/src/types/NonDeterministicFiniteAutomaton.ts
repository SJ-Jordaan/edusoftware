import { DeterministicFiniteAutomaton } from './DeterministicFiniteAutomaton';

export interface NonDeterministicFiniteAutomaton {
  /** The alphabet of the NFA, represented as a list of characters. */
  alphabet: string[];

  /** A list of all states in the NFA. */
  states: string[];

  /**
   * Transition function represented as a nested object where delta[state][symbol]
   * is a list of states. The empty string '' represents epsilon transitions.
   */
  delta: { [state: string]: { [symbol: string]: string[] | undefined } };

  /** A list of initial states. Multiple start states are allowed. */
  initial: string[];

  /** A list of accepting (final) states. */
  final: string[];

  /**
   * Computes the epsilon closure of a given set of states, returning all states
   * reachable via epsilon transitions.
   * @param states A list of states to compute the epsilon closure for.
   * @returns A list of states in the epsilon closure.
   */
  epsilon_closure(states: string[]): string[];

  /**
   * Performs a transition from a given set of states using a specific symbol.
   * @param states A set of states.
   * @param sym A symbol from the alphabet.
   * @returns The set of states reached from the input states using the symbol.
   */
  step(states: string[], sym: string): string[];

  /**
   * Determines whether the NFA accepts a given string.
   * @param str The string to check against the NFA.
   * @returns `true` if the string is accepted, otherwise `false`.
   */
  accepts(str: string): boolean;

  /**
   * Converts the NFA to an equivalent DFA.
   * @returns An equivalent DFA.
   */
  to_DFA(): DeterministicFiniteAutomaton;

  /**
   * Minimizes the NFA by converting it to a minimal equivalent DFA.
   * @returns A minimal DFA equivalent to this NFA.
   */
  minimized(): DeterministicFiniteAutomaton;

  /**
   * Reverses the NFA, producing a new NFA that accepts the reverse of the language.
   * @returns A new NFA that accepts the reverse of the original language.
   */
  reversed(): NonDeterministicFiniteAutomaton;

  /**
   * Clones the NFA, optionally prefixing state names.
   * @param prefix Optional prefix for state names in the cloned NFA.
   * @returns A clone of the NFA.
   */
  _clone(prefix?: string): NonDeterministicFiniteAutomaton;

  /**
   * Concatenates the language of this NFA with another NFA's language.
   * @param other The NFA to concatenate with.
   * @returns A new NFA representing the concatenation.
   */
  concat(
    other: NonDeterministicFiniteAutomaton,
  ): NonDeterministicFiniteAutomaton;

  /**
   * Forms the union of the language of this NFA with another NFA's language.
   * @param other The NFA to form the union with.
   * @returns A new NFA representing the union.
   */
  union(
    other: NonDeterministicFiniteAutomaton,
  ): NonDeterministicFiniteAutomaton;

  /**
   * Applies the Kleene star operation to the language of this NFA.
   * @returns A new NFA representing the Kleene star of the original language.
   */
  star(): NonDeterministicFiniteAutomaton;

  /**
   * Applies the Kleene plus operation to the language of this NFA.
   * @returns A new NFA representing the Kleene plus of the original language.
   */
  plus(): NonDeterministicFiniteAutomaton;

  /**
   * Repeats the language of this NFA a specified number of times.
   * @param n The number of repetitions.
   * @returns A new NFA representing the repeated language.
   */
  repeat(n: number): NonDeterministicFiniteAutomaton;

  /**
   * Makes the language of this NFA optional (equivalent to the '?' operator).
   * @returns A new NFA that also accepts the empty string.
   */
  optional(): NonDeterministicFiniteAutomaton;

  /**
   * Constructs an NFA that matches exactly the given string.
   * @param str The string to match.
   * @param alphabet The alphabet of the NFA.
   * @returns An NFA that matches exactly the specified string.
   */
  for(str: string, alphabet: string[]): NonDeterministicFiniteAutomaton;

  /**
   * Generates a Dot format graph representation of the NFA.
   * @returns A string representing the NFA in Dot format.
   */
  dottified(): string;
}
