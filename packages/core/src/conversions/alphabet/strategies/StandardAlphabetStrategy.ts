import { AlphabetStrategy } from './AlphabetStrategy';

/**
 * Standard implementation of the AlphabetStrategy for normalising and displaying alphabets.
 */
export class StandardAlphabetStrategy implements AlphabetStrategy {
  normalise(alphabet: string | string[]): string {
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

    return alphabet
      .split('')
      .map((char) => this.normaliseCharacter(char))
      .filter((char) => char !== '')
      .join('');
  }

  display(alphabet: string | string[]): string {
    if (alphabet === '') {
      return 'ε';
    }

    if (Array.isArray(alphabet)) {
      return alphabet.map((char) => this.displayCharacter(char)).join('');
    }

    return alphabet
      .split('')
      .map((char) => this.displayCharacter(char))
      .join('');
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
