import { NFA } from 'dfa-lib';
import { NFAConversionStrategy } from './NFAConversionStrategy';

export class GridAutomatonNFAStrategy extends NFAConversionStrategy {
  convert(automaton) {
    const states = automaton.filter((e) => e.type === 'state');
    const transitions = automaton.filter((e) => e.type === 'transition');

    const stateByPosition = new Map(
      states.map((state) => [
        `${state.position.x},${state.position.y}`,
        state.id,
      ])
    );

    const alphabet = [
      ...new Set(
        transitions.flatMap((transition) =>
          transition.transitions.flatMap((t) => t.symbols)
        )
      ),
    ];

    const delta = {};
    states.forEach((state) => {
      delta[state.id] = {};
      alphabet.forEach((symbol) => (delta[state.id][symbol] = []));
    });

    transitions.forEach((transition) => {
      const fromPos = this._adjustCoordinatesForDirection(
        transition.position.x,
        transition.position.y,
        transition.startSide
      );
      const toPos = this._adjustCoordinatesForDirection(
        transition.position.x,
        transition.position.y,
        transition.endSide
      );

      const fromStateId = stateByPosition.get(`${fromPos.x},${fromPos.y}`);
      const toStateId = stateByPosition.get(`${toPos.x},${toPos.y}`);

      if (fromStateId && toStateId) {
        transition.symbols.forEach((symbol) => {
          if (!delta[fromStateId][symbol].includes(toStateId)) {
            delta[fromStateId][symbol].push(toStateId);
          }
        });
      }
    });

    const initial = states.filter((s) => s.isStart).map((s) => s.id);
    const finals = states.filter((s) => s.isFinal).map((s) => s.id);

    return new NFA(alphabet, delta, initial, finals);
  }

  _adjustCoordinatesForDirection(x, y, direction) {
    switch (direction) {
    case 'top':
      return { x, y: y - 1 };
    case 'bottom':
      return { x, y: y + 1 };
    case 'left':
      return { x: x - 1, y };
    case 'right':
      return { x: x + 1, y };
    default:
      return { x, y };
    }
  }
}
