import '../../../polyfills/index';

import { NFA } from 'dfa-lib';
import { NFAConversionStrategy } from './NFAConversionStrategy';
import {
  GridAutomaton,
  GridAutomatonSchema,
  GridAutomatonState,
  GridAutomatonTransition,
} from '../../../types/GridAutomaton';

/**
 * Strategy for converting a grid automaton to an NFA.
 */
export class GridAutomatonNFAStrategy implements NFAConversionStrategy {
  /**
   * Converts a grid automaton to an NFA.
   * @param automaton - The grid automaton to convert.
   * @returns The constructed NFA.
   */
  convert(automaton: GridAutomaton) {
    // Validate the automaton input
    const parsedAutomaton = GridAutomatonSchema.safeParse(automaton);
    if (!parsedAutomaton.success) {
      throw new Error('Invalid grid automaton format');
    }

    const states = parsedAutomaton.data.filter(
      (element) => element.type === 'state',
    ) as GridAutomatonState[];
    const transitions = parsedAutomaton.data.filter(
      (element) => element.type === 'transition',
    ) as GridAutomatonTransition[];

    const stateByPosition = new Map(
      states.map((state) => [
        `${state.position.x},${state.position.y}`,
        state.id,
      ]),
    );

    const alphabet = [
      ...new Set(
        transitions.flatMap((transition) =>
          transition.transitions.flatMap((t) => t.symbols),
        ),
      ),
    ];

    const delta: { [key: string]: { [symbol: string]: string[] } } = {};

    states.forEach((state) => {
      delta[state.id] = {};
      alphabet.forEach((symbol) => (delta[state.id][symbol] = []));
    });

    transitions.forEach((transition) => {
      transition.transitions.forEach((t) => {
        const fromPos = this._adjustCoordinatesForDirection(
          transition.position.x,
          transition.position.y,
          t.startSide,
        );
        const toPos = this._adjustCoordinatesForDirection(
          transition.position.x,
          transition.position.y,
          t.endSide,
        );

        const fromStateId = stateByPosition.get(`${fromPos.x},${fromPos.y}`);
        const toStateId = stateByPosition.get(`${toPos.x},${toPos.y}`);

        if (fromStateId && toStateId) {
          t.symbols.forEach((symbol) => {
            if (!delta[fromStateId][symbol].includes(toStateId)) {
              delta[fromStateId][symbol].push(toStateId);
            }
          });
        }
      });
    });

    const initial = states.filter((s) => s.isStart).map((s) => s.id);
    const finals = states.filter((s) => s.isFinal).map((s) => s.id);

    return new NFA(alphabet, delta, initial, finals);
  }

  /**
   * Adjusts coordinates based on the direction of a transition.
   * @param x - The x coordinate.
   * @param y - The y coordinate.
   * @param direction - The direction of the transition.
   * @returns The adjusted coordinates.
   */
  private _adjustCoordinatesForDirection(
    x: number,
    y: number,
    direction: 'top' | 'bottom' | 'left' | 'right',
  ) {
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
