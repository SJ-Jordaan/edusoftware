import { AlphabetStrategy } from './AlphabetStrategy';

/**
 * Standard implementation of the AlphabetStrategy for normalising and displaying alphabets.
 */
export class StandardAlphabetStrategy implements AlphabetStrategy {
  normalise(alphabet: string | string[]): string {
    if (!alphabet) {
      throw new Error('Alphabet must not be empty.');
    }

    // Handling an array of characters
    if (Array.isArray(alphabet)) {
      return alphabet
        .map((char) => {
          if (typeof char === 'string') {
            // Recursive normalisation for each character
            return this.normaliseCharacter(char);
          }
          throw new Error('Invalid character type in alphabet array.');
        })
        .filter((char) => char !== '')
        .join('');
    }

    // Directly handle a single character or string
    return this.normaliseCharacter(alphabet);
  }

  display(alphabet: string | string[]): string {
    if (!alphabet) {
      throw new Error('Alphabet must not be empty.');
    }

    if (Array.isArray(alphabet)) {
      return alphabet.map((char) => this.displayCharacter(char)).join('');
    }

    return this.displayCharacter(alphabet);
  }

  private normaliseCharacter(char: string): string {
    switch (char) {
      case '∅':
        return '∅';
      case 'ε':
        return '';
      case '∪':
        return '|';
      default:
        return char;
    }
  }

  private displayCharacter(char: string): string {
    switch (char) {
      case '∅':
        return '∅';
      case '':
        return 'ε';
      case '|':
        return '∪';
      default:
        return char;
    }
  }
}
