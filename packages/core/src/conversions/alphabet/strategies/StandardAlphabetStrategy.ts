import { AlphabetStrategy } from './AlphabetStrategy';

export class StandardAlphabetStrategy extends AlphabetStrategy {
  normalise(alphabet) {
    if (!alphabet) {
      return '';
    }

    if (Array.isArray(alphabet)) {
      return alphabet
        .map((char) => this.normalise(char))
        .filter((char) => char !== '');
    }

    if (typeof alphabet === 'string' && alphabet.length > 1) {
      return this.normalise(alphabet.split('')).join('');
    }

    switch (alphabet) {
      case '∅':
        return '∅';
      case 'ε':
        return '';
      case '∪':
        return '|';
      default:
        return alphabet;
    }
  }

  display(alphabet) {
    if (Array.isArray(alphabet)) {
      return alphabet.map((char) => this.display(char));
    }

    if (typeof alphabet === 'string' && alphabet.length > 1) {
      return this.display(alphabet.split('')).join('');
    }

    switch (alphabet) {
      case '∅':
        return '∅';
      case '':
        return 'ε';
      case '|':
        return '∪';
      default:
        return alphabet;
    }
  }
}
