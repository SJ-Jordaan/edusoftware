import { parseOrNull } from '@edusoftware/core/src/algorithms';

import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { GateType } from '../grid-circuit/LogicGates';

export interface Gate {
  id: string;
  position: { x: number; y: number };
  gateType: GateType;
  output: string; // ID of gate to which piece leads
}

interface GridGateState {
  isEditable: boolean;
  pieces: Gate[];
  toolbar: Partial<Gate>[];
}

interface MoveOrAddPiecePayload {
  item: Omit<Gate, 'id'> & Partial<Pick<Gate, 'id'>>;
  x: number;
  y: number;
  type?: GateType;
}

const initialState: GridGateState = {
  isEditable: true,
  pieces: [
    {
      id: 'gate-1',
      position: { x: 0, y: 0 },
      gateType: 'and',
      output: 'gate-3',
    },
    {
      id: 'gate-2',
      position: { x: 1, y: 0 },
      gateType: 'or',
      output: 'gate-3',
    },
    {
      id: 'gate-3',
      position: { x: 2, y: 1 },
      gateType: 'not',
      output: '',
    },
    {
      id: 'gate-4',
      position: { x: 1, y: 2 },
      gateType: 'xor',
      output: 'gate-3',
    },
  ],
  toolbar: [
    {
      position: { x: 0, y: 0 },
      gateType: 'and',
      output: '',
    },
    {
      position: { x: 0, y: 0 },
      gateType: 'or',
      output: '',
    },
    {
      position: { x: 0, y: 0 },
      gateType: 'not',
      output: '',
    },
    {
      position: { x: 0, y: 0 },
      gateType: 'xor',
      output: '',
    },
  ],
};

function prepareMoveOrAddPiecePayload(
  item: Omit<Gate, 'id'> & Partial<Pick<Gate, 'id'>>,
  x: number,
  y: number,
  type: GateType,
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

const gridCircuitSlice = createSlice({
  name: 'circuit',
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
    // initToolbar(state, action: PayloadAction<Alphabet | undefined>) {
    //   state.toolbar = createPieces(action.payload);
    // },
    deletePiece(state, action: PayloadAction<string>) {
      state.pieces = state.pieces.filter(
        (piece) => piece.id !== action.payload,
      );
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
          } as Gate);
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
        item: Omit<Gate, 'id'> & Partial<Pick<Gate, 'id'>>,
        x: number,
        y: number,
        type: GateType,
      ) {
        return { payload: prepareMoveOrAddPiecePayload(item, x, y, type) };
      },
    },
  },
});

export const { initGrid, deletePiece, moveOrAddPiece } =
  gridCircuitSlice.actions;

export default gridCircuitSlice.reducer;
