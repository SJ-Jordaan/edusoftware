import { parseOrNull } from '@edusoftware/core/src/algorithms';

import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { GateType } from './LogicGates';

export interface Gate {
  id: string;
  position: { x: number; y: number };
  gateType: GateType;
  inputs?: string[];
  output?: string; // ID of gate to which piece leads
  label?: string;
}

interface GridGateState {
  isEditable: boolean;
  pieces: Gate[];
  toolbar: Partial<Gate>[];
  answer: string;
}

interface MoveOrAddPiecePayload {
  item: Omit<Gate, 'id'> & Partial<Pick<Gate, 'id'>>;
  x: number;
  y: number;
  type?: GateType;
}

interface ConnectPiecePayload {
  pieceAId: string;
  pieceBId: string;
}

const initialState: GridGateState = {
  isEditable: true,
  pieces: [
    {
      id: 'gate-1',
      position: { x: 0, y: 0 },
      gateType: 'and',
    },
    {
      id: 'gate-2',
      position: { x: 1, y: 0 },
      gateType: 'or',
    },
    {
      id: 'gate-3',
      position: { x: 2, y: 1 },
      gateType: 'not',
    },
    {
      id: 'gate-4',
      position: { x: 1, y: 3 },
      gateType: 'xor',
    },
    {
      id: 'gate-5',
      position: { x: 1, y: 4 },
      gateType: 'input',
      label: 'X',
    },
    {
      id: 'gate-6',
      position: { x: 1, y: 5 },
      gateType: 'input',
      label: 'Y',
    },
    {
      id: 'gate-6.1',
      position: { x: 3, y: 5 },
      gateType: 'input',
      label: 'W',
    },
    {
      id: 'gate-7',
      position: { x: 2, y: 5 },
      gateType: 'input',
      label: 'Z',
    },
    {
      id: 'gate-8',
      position: { x: 5, y: 3 },
      gateType: 'output',
      label: 'A',
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
  answer: '',
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

      state.pieces = pieces;
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
    connectPieces: {
      reducer(state, action: PayloadAction<ConnectPiecePayload>) {
        const { pieceAId, pieceBId } = action.payload;
        const updatedElements = [...state.pieces];

        const pieceAIndex = updatedElements.findIndex(
          (element) => element.id === pieceAId,
        );
        const pieceBIndex = updatedElements.findIndex(
          (element) => element.id === pieceBId,
        );

        // Remove the gate as an input from all other gates
        updatedElements.forEach((gate, i) => {
          if (gate.inputs?.includes(pieceAId)) {
            updatedElements[i] = {
              ...gate,
              inputs: gate.inputs.filter((id) => id !== pieceAId),
            };
          }
        });

        if (pieceAIndex !== -1 && pieceAId === pieceBId) {
          const startElement = updatedElements[pieceAIndex];

          updatedElements[pieceAIndex] = {
            ...startElement,
            output: undefined,
          };

          state.pieces = updatedElements;
          return;
        }

        if (pieceAIndex !== -1 && pieceBIndex !== -1) {
          const startElement = updatedElements[pieceAIndex];
          const endElement = updatedElements[pieceBIndex];

          let oldInputId: string | undefined;

          updatedElements[pieceAIndex] = {
            ...startElement,
            output: pieceBId,
          };

          const toGateType = updatedElements[pieceBIndex].gateType;
          if (toGateType === 'not' || toGateType === 'output') {
            oldInputId = endElement.inputs?.at(0);
            updatedElements[pieceBIndex] = {
              ...endElement,
              inputs: [pieceAId],
            };
          } else if (toGateType === 'input') {
            state.pieces = updatedElements;
            return;
          } else {
            const inputs = [...(updatedElements[pieceBIndex].inputs ?? [])];

            if (inputs.length === 2) {
              oldInputId = inputs[1];
              inputs[1] = pieceAId;
            } else {
              inputs.push(pieceAId);
            }
            updatedElements[pieceBIndex] = {
              ...endElement,
              inputs,
            };
          }

          updatedElements.forEach((gate, i) => {
            if (gate.id === oldInputId) {
              updatedElements[i] = {
                ...gate,
                output: undefined,
              };
            }
          });
        }

        state.pieces = updatedElements;
      },
      prepare(pieceAId: string, pieceBId: string) {
        return { payload: { pieceAId, pieceBId } };
      },
    },
  },
});

export const { initGrid, deletePiece, moveOrAddPiece, connectPieces } =
  gridCircuitSlice.actions;

export default gridCircuitSlice.reducer;
