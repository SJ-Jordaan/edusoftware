/**
 * Interface for alphabet strategies, defining methods for normalising
 * and displaying alphabets.
 */
export interface AlphabetStrategy {
  /**
   * Normalises the given alphabet into a standard format.
   * @param alphabet - The alphabet to normalise.
   * @returns The normalised alphabet.
   */
  normalise(alphabet: string | string[]): string;

  /**
   * Converts the normalised alphabet into a human-readable format.
   * @param alphabet - The alphabet to display.
   * @returns The display string of the alphabet.
   */
  display(alphabet: string | string[]): string;
}
