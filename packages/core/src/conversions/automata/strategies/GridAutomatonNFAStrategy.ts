import { NFA } from 'dfa-lib';
import { NFAConversionStrategy } from './NFAConversionStrategy';
import { z } from 'zod';

/**
 * Defines the structure for a state in a grid automaton.
 */
export const GridAutomatonStateSchema = z.object({
  id: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  type: z.literal('state'),
  isStart: z.boolean().optional(),
  isFinal: z.boolean().optional(),
});

/**
 * Defines the structure for a transition in a grid automaton.
 */
export const GridAutomatonTransitionSchema = z.object({
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  type: z.literal('transition'),
  startSide: z.enum(['top', 'bottom', 'left', 'right']),
  endSide: z.enum(['top', 'bottom', 'left', 'right']),
  transitions: z.array(
    z.object({
      symbols: z.array(z.string()),
    }),
  ),
});

/**
 * A union schema for elements in a grid automaton, which can be either states or transitions.
 */
export const GridAutomatonElementSchema = z.union([
  GridAutomatonStateSchema,
  GridAutomatonTransitionSchema,
]);

/**
 * Schema for validating the entire grid automaton array.
 */
export const GridAutomatonSchema = z.array(GridAutomatonElementSchema);

export type GridAutomatonState = z.infer<typeof GridAutomatonStateSchema>;
export type GridAutomatonTransition = z.infer<
  typeof GridAutomatonTransitionSchema
>;
export type GridAutomatonElement = z.infer<typeof GridAutomatonElementSchema>;
export type GridAutomaton = Array<GridAutomatonElement>;

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
      const fromPos = this._adjustCoordinatesForDirection(
        transition.position.x,
        transition.position.y,
        transition.startSide,
      );
      const toPos = this._adjustCoordinatesForDirection(
        transition.position.x,
        transition.position.y,
        transition.endSide,
      );

      const fromStateId = stateByPosition.get(`${fromPos.x},${fromPos.y}`);
      const toStateId = stateByPosition.get(`${toPos.x},${toPos.y}`);

      if (fromStateId && toStateId) {
        transition.transitions.forEach((t) => {
          t.symbols.forEach((symbol) => {
            if (!delta[fromStateId][symbol].includes(toStateId)) {
              delta[fromStateId][symbol].push(toStateId);
            }
          });
        });
      }
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
