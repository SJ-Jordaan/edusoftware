import { AutomatonInput } from '../../types/AutomatonInput';
import { CanvasAutomatonSchema } from '../../types/CanvasAutomaton';
import { GridAutomatonSchema } from '../../types/GridAutomaton';
import {
  CanvasAutomatonNFAStrategy,
  GridAutomatonNFAStrategy,
  NFAConversionStrategy,
  RegexNFAStrategy,
} from './strategies';

export class AutomatonConverter {
  private representation: AutomatonInput;
  private alphabet: string;
  private strategy: NFAConversionStrategy;

  constructor(representation: AutomatonInput, alphabet: string) {
    this.representation = representation;
    this.alphabet = alphabet;
    this.strategy = this.selectStrategy();
  }

  private selectStrategy(): NFAConversionStrategy {
    if (typeof this.representation === 'string') {
      try {
        const parsed = JSON.parse(this.representation);
        if (CanvasAutomatonSchema.safeParse(parsed).success) {
          return new CanvasAutomatonNFAStrategy();
        }

        if (GridAutomatonSchema.safeParse(parsed).success) {
          return new GridAutomatonNFAStrategy();
        }
      } catch (error) {
        return new RegexNFAStrategy();
      }
    }

    // Direct object inputs
    if (CanvasAutomatonSchema.safeParse(this.representation).success) {
      return new CanvasAutomatonNFAStrategy();
    } else if (GridAutomatonSchema.safeParse(this.representation).success) {
      return new GridAutomatonNFAStrategy();
    }

    throw new Error('Automaton format is not supported or is invalid.');
  }

  convert() {
    try {
      return this.strategy.convert(this.representation, this.alphabet);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to convert automaton to NFA: ${error.message}`);
      }
      throw new Error(
        'Failed to convert automaton to NFA due to an unexpected error.',
      );
    }
  }
}
