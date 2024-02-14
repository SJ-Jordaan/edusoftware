import { StandardAlphabetStrategy } from 'common/conversions/alphabet';
import { NFAConversionStrategy } from './NFAConversionStrategy';
import to_NFA from 'dfa-lib/regex.js';

export class RegexNFAStrategy extends NFAConversionStrategy {
  convert(regex, alphabet) {
    try {
      const alphabetStrategy = new StandardAlphabetStrategy();
      const normalisedAlphabet = alphabetStrategy.normalise(alphabet);
      const normalisedRegex = alphabetStrategy.normalise(regex);

      if (typeof normalisedAlphabet === 'string') {
        return to_NFA(normalisedRegex, normalisedAlphabet.split(''));
      }

      return to_NFA(normalisedRegex, normalisedAlphabet);
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
