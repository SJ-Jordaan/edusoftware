import { createPieces, parseOrNull } from '@edusoftware/core/src/algorithms';

import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import {
  Alphabet,
  Piece,
  PieceType,
  Side,
} from '@edusoftware/core/src/types/GridAutomaton';

interface GridAutomatonState {
  isEditable: boolean;
  pieces: Piece[];
  toolbar: Partial<Piece>[];
}

interface MoveOrAddPiecePayload {
  item: Omit<Piece, 'id'> & Partial<Pick<Piece, 'id'>>;
  x: number;
  y: number;
  type?: PieceType;
}

const initialState: GridAutomatonState = {
  pieces: [],
  toolbar: [],
  isEditable: false,
};

const rotateSide = (side: Side) => {
  const rotationMap: Record<Side, Side> = {
    top: 'right',
    right: 'bottom',
    bottom: 'left',
    left: 'top',
  };
  return rotationMap[side];
};

function prepareMoveOrAddPiecePayload(
  item: Omit<Piece, 'id'> & Partial<Pick<Piece, 'id'>>,
  x: number,
  y: number,
  type: PieceType,
) {
  const isExistingPiece = item.id !== undefined;

  const payload: MoveOrAddPiecePayload = {
    item: {
      ...item,
      id: isExistingPiece ? item.id : `${type}-${nanoid()}`,
    },
    x,
    y,
    type,
  };

  return payload;
}

const gridAutomatonSlice = createSlice({
  name: 'automaton',
  initialState,
  reducers: {
    setEdit(state, action: PayloadAction<boolean>) {
      state.isEditable = action.payload;
    },
    initGrid(state, action: PayloadAction<string>) {
      const stringifiedPieces = action.payload;
      const pieces = parseOrNull(stringifiedPieces);

      state.pieces = pieces ?? [
        {
          id: 'start',
          type: 'state',
          position: { x: 0, y: 0 },
          isFinal: false,
          isStart: true,
          label: 'start',
        },
      ];
    },
    initToolbar(state, action: PayloadAction<Alphabet | undefined>) {
      state.toolbar = createPieces(action.payload);
    },
    deletePiece(state, action: PayloadAction<string>) {
      state.pieces = state.pieces.filter(
        (piece) => piece.id !== action.payload,
      );
    },
    toggleFinalState(state, action: PayloadAction<string>) {
      const piece = state.pieces.find((p) => p.id === action.payload);
      if (piece && piece.type === 'state') {
        piece.isFinal = !piece.isFinal;
      }
    },
    rotateTransition(state, action: PayloadAction<string>) {
      const piece = state.pieces.find((p) => p.id === action.payload);
      if (piece && piece.type === 'transition') {
        piece.transitions.forEach((transition) => {
          transition.startSide = rotateSide(transition.startSide);
          transition.endSide = rotateSide(transition.endSide);
        });
      }
    },
    moveOrAddPiece: {
      reducer(state, action: PayloadAction<MoveOrAddPiecePayload>) {
        const { item, x, y, type } = action.payload;
        const updatedElements = [...state.pieces];

        const movingElementIndex = updatedElements.findIndex(
          (element) => element.id === item.id,
        );
        const targetElementIndex = updatedElements.findIndex(
          (element) => element.position.x === x && element.position.y === y,
        );

        if (targetElementIndex !== -1 && movingElementIndex !== -1) {
          // Swap positions if both elements are found
          const targetElement = updatedElements[targetElementIndex];
          const movingElement = updatedElements[movingElementIndex];

          updatedElements[movingElementIndex] = {
            ...movingElement,
            position: { ...targetElement.position },
          };
          updatedElements[targetElementIndex] = {
            ...targetElement,
            position: { ...movingElement.position },
          };
        } else if (movingElementIndex === -1) {
          // Add a new piece if it doesn't exist
          updatedElements.push({
            ...item,
            type: type,
            position: { x, y },
          } as Piece);
        } else {
          // Move the existing piece to a new position
          updatedElements[movingElementIndex] = {
            ...updatedElements[movingElementIndex],
            position: { x, y },
          };
        }

        state.pieces = updatedElements;
      },
      prepare(
        item: Omit<Piece, 'id'> & Partial<Pick<Piece, 'id'>>,
        x: number,
        y: number,
        type: PieceType,
      ) {
        return { payload: prepareMoveOrAddPiecePayload(item, x, y, type) };
      },
    },
  },
});

export const {
  initGrid,
  initToolbar,
  deletePiece,
  toggleFinalState,
  rotateTransition,
  moveOrAddPiece,
} = gridAutomatonSlice.actions;

export default gridAutomatonSlice.reducer;
