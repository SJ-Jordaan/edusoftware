import { RegexInputSchema } from '../../../types/RegexInput';
import { StandardAlphabetStrategy } from '../../alphabet';
import { NFAConversionStrategy } from './NFAConversionStrategy';
import to_NFA from 'dfa-lib/regex.js';

/**
 * Strategy for converting regular expressions into NFAs.
 */
export class RegexNFAStrategy implements NFAConversionStrategy {
  /**
   * Converts a regular expression and an alphabet into an NFA.
   * @param regex - The regular expression to convert.
   * @param alphabet - The alphabet to use for the conversion.
   * @returns An NFA that represents the regular expression.
   * @throws Throws an error if the conversion fails.
   */
  convert(regex: string, alphabet: string) {
    try {
      // Validate inputs
      const result = RegexInputSchema.safeParse({ regex, alphabet });
      if (!result.success) {
        throw new Error('Invalid input for regex conversion.');
      }

      const { regex: validRegex, alphabet: validAlphabet } = result.data;

      const alphabetStrategy = new StandardAlphabetStrategy();
      const normalisedAlphabet = alphabetStrategy.normalise(validAlphabet);
      const normalisedRegex = alphabetStrategy.normalise(validRegex);

      // Assuming the normalisedAlphabet is always a string; adjust if necessary.
      return to_NFA(normalisedRegex, normalisedAlphabet.split(''));
    } catch (error: unknown) {
      // Use a type guard to check if the error is an instance of Error
      if (error instanceof Error) {
        throw new Error(`Failed to convert regex to NFA: ${error.message}`);
      } else {
        // If the error is not an instance of Error, it might not have a message property
        throw new Error(
          'Failed to convert regex to NFA due to an unexpected error.',
        );
      }
    }
  }
}
