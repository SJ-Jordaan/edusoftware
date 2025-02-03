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
  id: z.string().optional(), // Assuming IDs might be optional for transitions
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  type: z.literal('transition'),
  transitions: z.array(
    z.object({
      symbols: z.array(z.string()),
      startSide: z.enum(['top', 'bottom', 'left', 'right']),
      endSide: z.enum(['top', 'bottom', 'left', 'right']),
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
export type Alphabet = Record<string, boolean>;

export type Side = 'top' | 'right' | 'bottom' | 'left';

export interface Position {
  x: number;
  y: number;
}

export type PieceType = 'state' | 'transition';

export interface BasePiece {
  id: string;
  type: 'state' | 'transition';
  position: Position;
}

export interface StatePiece extends BasePiece {
  type: 'state';
  isFinal: boolean;
  isStart: boolean;
}

export interface Transition {
  symbols: string[];
  startSide: Side;
  endSide: Side;
}

export interface TransitionPiece extends BasePiece {
  type: 'transition';
  transitions: Transition[];
}

export type Piece = StatePiece | TransitionPiece;

export const automataTypes = {
  STATE: 'state',
  TRANSITION: 'transition',
};
