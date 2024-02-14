import {
  CanvasAutomatonNFAStrategy,
  GridAutomatonNFAStrategy,
  RegexNFAStrategy,
} from './strategies';

export class AutomatonConverter {
  constructor(representation, alphabet) {
    this._representation = representation;
    this._alphabet = alphabet;
    this.strategy = this._selectStrategy();
  }

  _selectStrategy() {
    if (typeof this._representation === 'string') {
      try {
        const parsedRepresentation = JSON.parse(this._representation);
        if (Array.isArray(parsedRepresentation)) {
          this._representation = parsedRepresentation;
          return new GridAutomatonNFAStrategy(parsedRepresentation);
        }
        throw new Error('No strategy found for the given automaton');
      } catch (error) {
        return new RegexNFAStrategy(this._representation, this._alphabet);
      }
    }

    if (!this._representation) {
      throw new Error('No automaton provided');
    }

    if (Array.isArray(this._representation)) {
      return new GridAutomatonNFAStrategy(this._representation);
    }

    if (this._representation.transitions && this._representation.states) {
      return new CanvasAutomatonNFAStrategy(this._representation);
    }

    throw new Error('No strategy found for the given automaton');
  }

  convert() {
    return this.strategy.convert(this._representation, this._alphabet);
  }
}
