import { NFA } from 'dfa-lib';
import { NFAConversionStrategy } from './NFAConversionStrategy';

export class CanvasAutomatonNFAStrategy extends NFAConversionStrategy {
  convert(automaton) {
    const alphabet = automaton.alphabet;

    const delta = {};
    automaton.states.forEach((state) => {
      delta[state] = {};
    });

    automaton.transitions.forEach((transition) => {
      if (transition.label === '') {
        return;
      }

      if (!(transition.label in delta[transition.from])) {
        delta[transition.from][transition.label] = [];
      }
      if (transition.to) {
        delta[transition.from][transition.label].push(transition.to);
      }
    });

    const initial = [automaton.initial];
    const final = automaton.finals;

    return new NFA(alphabet, delta, initial, final);
  }
}
