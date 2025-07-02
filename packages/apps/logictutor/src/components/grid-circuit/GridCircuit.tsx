import { useAppDispatch, useAppSelector } from '../../store';
import { DraggableGate } from './DraggableGate';
import {
  Gate,
  moveOrAddPiece,
  connectPieces,
} from '../grid-automaton-builder/gridCircuitSlice';
import { GateType } from './LogicGates';
import { GridCell } from './GridCell';
import { useState } from 'react';

const GridCircuit = () => {
  const dispatch = useAppDispatch();
  const pieces = useAppSelector((state) => state.gridCircuit.pieces);

  const handleDrop = (item: Gate, x: number, y: number, type: GateType) => {
    setClickedGate(null);
    dispatch(moveOrAddPiece(item, x, y, type));
  };

  const [clickedGate, setClickedGate] = useState<Gate | null>(null);
  const [booleanExpression, setBooleanExpression] = useState<string>('');
  const [truthTable, setTruthTable] = useState<string>('');

  const renderCellContent = (x: number, y: number) => {
    const cellContent = pieces.find(
      (element) => element.position.x === x && element.position.y === y,
    );
    if (!cellContent) return null;

    return (
      <DraggableGate
        id={cellContent.id}
        key={`state-${cellContent.id}`}
        gateType={cellContent.gateType}
        inputLabel={cellContent.label}
        onClick={() => handleGateClick(cellContent)}
      />
    );
  };

  const handleGateClick = (gate: Gate) => {
    if (clickedGate === null) {
      if (gate.gateType === 'output') return;
      setClickedGate(gate);
      return;
    }
    dispatch(connectPieces(clickedGate.id, gate.id));
    setClickedGate(null);
  };

  const getCellOutputPosition = (x: number, y: number) => {
    const cellSize = 112;
    return {
      x: x * cellSize + cellSize - 2,
      y: y * cellSize + cellSize / 2,
    };
  };

  const getCellInputPosition = (outputGate: Gate) => {
    const cellSize = 112;
    const inputGate = pieces.find(
      (element) => outputGate.output === element.id,
    );
    if (inputGate?.gateType === 'not' || inputGate?.gateType === 'output')
      return {
        x: inputGate.position.x * cellSize + 2,
        y: inputGate.position.y * cellSize + cellSize / 2,
      };

    if (inputGate?.inputs?.at(0) === outputGate.id) {
      return {
        x: inputGate.position.x * cellSize + 2,
        y: inputGate.position.y * cellSize + cellSize / 3 - 1,
      };
    }
    if (inputGate?.inputs?.at(1) === outputGate.id) {
      return {
        x: inputGate.position.x * cellSize + 2,
        y: inputGate.position.y * cellSize + cellSize * (2 / 3) - 1,
      };
    }
  };

  const generateBooleanExpression = () => {
    const outputGate = pieces.find((gate) => gate.gateType === 'output');

    if (!outputGate) return '';

    setBooleanExpression(convertToExpression(outputGate).join(''));
  };

  const convertToExpression = (currentGate: Gate): string[] => {
    if ((currentGate.inputs?.length ?? 1) > 2) {
      return [];
    }

    if (
      currentGate.gateType !== 'input' &&
      (!currentGate.inputs || currentGate.inputs.length === 0)
    ) {
      return [];
    }

    if (currentGate.inputs?.length === 2) {
      const leftGate = pieces.find(
        (gate) => gate.id === currentGate.inputs?.at(0),
      );
      const rightGate = pieces.find(
        (gate) => gate.id === currentGate.inputs?.at(1),
      );

      if (!leftGate || !rightGate) return [];

      return [
        ...convertToExpression(leftGate),
        ...convertToExpression(rightGate),
        expressionMap[currentGate.gateType],
      ];
    }

    if (currentGate.gateType === 'output' || currentGate.gateType === 'not') {
      const nextGate = pieces.find(
        (gate) => gate.id === currentGate.inputs?.at(0),
      );

      if (!nextGate) return [];

      return [
        ...convertToExpression(nextGate),
        expressionMap[currentGate.gateType],
      ];
    }

    if (currentGate.gateType === 'input') {
      return [currentGate.label ?? '?'];
    }

    return [];
  };

  const generateTruthTable = () => {
    const inputGates = pieces
      .filter((gate) => gate.label !== undefined && gate.gateType === 'input')
      .sort((a, b) => a.id.localeCompare(b.id));

    const numInputs = inputGates.length;
    const numTruth = 1 << numInputs;

    let truthTable = '';

    for (let i = 0; i < numTruth; i++) {
      const inputMap: Record<string, boolean> = {};

      for (let j = 0; j < numInputs; j++) {
        const label = inputGates[j].label!;
        inputMap[label] = !!(i & (1 << (numInputs - j - 1)));
      }
      truthTable += testInput(booleanExpression, inputMap);
    }
    setTruthTable(truthTable);
  };

  const testInput = (
    booleanExpression: string,
    boolMap: Record<string, boolean>,
  ) => {
    const operationStack: boolean[] = [];
    const isLetter = /^[a-zA-Z]$/.test(booleanExpression[0]);

    if (!isLetter) return;

    for (let i = 0; i < booleanExpression.length; i++) {
      const char = booleanExpression[i];
      if (/^[a-zA-Z]$/.test(char)) {
        operationStack.push(boolMap[char]);
      } else {
        if (char === '·') {
          const right = operationStack.pop();
          const left = operationStack.pop();
          if (right === undefined || left === undefined) return;
          operationStack.push(left && right);
        } else if (char === '+') {
          const right = operationStack.pop();
          const left = operationStack.pop();
          if (right === undefined || left === undefined) return;
          operationStack.push(left || right);
        } else if (char === '⊕') {
          const right = operationStack.pop();
          const left = operationStack.pop();
          if (right === undefined || left === undefined) return;
          operationStack.push(left !== right);
        } else if (char === '¬') {
          const val = operationStack.pop();
          if (val === undefined) return;
          operationStack.push(!val);
        }
      }
    }

    if (operationStack.length === 1) return operationStack[0];
  };

  const expressionMap: Record<GateType, string> = {
    and: '·',
    or: '+',
    xor: '⊕',
    not: '¬',
    input: 'token',
    output: '',
  };

  return (
    <div className="relative">
      <div className="absolute left-0 top-0">
        <button onClick={generateBooleanExpression}>
          Generate Boolean Expression
        </button>
        <div>{booleanExpression}</div>
      </div>
      <div className="absolute right-0 top-0">
        <button onClick={generateTruthTable}>Generate Truth Table</button>
        <div>{truthTable}</div>
      </div>
      <svg className="pointer-events-none absolute left-0 top-0 h-full w-full">
        {pieces.map((gate) => {
          const from = getCellOutputPosition(gate.position.x, gate.position.y);
          const to = getCellInputPosition(gate);
          if (!to) return null;

          return (
            <line
              key={gate.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#34d399"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      <div className="grid grid-cols-[repeat(6,_7rem)]">
        {Array.from({ length: 36 }, (_, index) => {
          const x = index % 6;
          const y = Math.floor(index / 6);
          const isSelected =
            clickedGate?.position.x === x && clickedGate?.position.y === y;

          return (
            <GridCell
              key={`cell-${index}`}
              x={x}
              y={y}
              onDrop={handleDrop}
              className={isSelected ? 'bg-red-600' : ''}
            >
              {renderCellContent(x, y)}
            </GridCell>
          );
        })}
      </div>
    </div>
  );
};

export default GridCircuit;
