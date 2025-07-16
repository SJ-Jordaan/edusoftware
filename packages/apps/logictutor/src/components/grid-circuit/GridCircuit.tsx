import { useAppDispatch, useAppSelector } from '../../store';
import { DraggableGate } from './DraggableGate';
import { Gate, moveOrAddPiece, connectPieces } from './gridCircuitSlice';
import { GateType } from './LogicGates';
import { GridSquare } from './GridSquare';
import { useEffect, useRef, useState } from 'react';

interface GridCircuitProps {
  cellScale: 1 | 2;
}

const GridCircuit = ({ cellScale }: GridCircuitProps) => {
  const dispatch = useAppDispatch();
  const pieces = useAppSelector((state) => state.gridCircuit.pieces);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleDrop = (
    item: Gate,
    x: number,
    y: number,
    type: GateType,
    label?: string,
  ) => {
    setClickedGate(null);
    dispatch(moveOrAddPiece(item, x, y, type, label));
  };

  const [clickedGate, setClickedGate] = useState<Gate | null>(null);

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
        isNew={false}
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
    const cellSize = 56 * cellScale;
    return {
      x: x * cellSize + cellSize - 2,
      y: y * cellSize + cellSize / 2,
    };
  };

  const getCellInputPosition = (outputGate: Gate) => {
    const cellSize = 56 * cellScale;
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

  return (
    <div className="flex justify-center">
      <div
        ref={containerRef}
        className="relative grid"
        style={{
          gridTemplateColumns: `repeat(6, ${3.5 * cellScale}rem)`,
        }}
      >
        {clickedGate &&
          (() => {
            const from = getCellOutputPosition(
              clickedGate.position.x,
              clickedGate.position.y,
            );
            return (
              <svg className="pointer-events-none absolute left-0 top-0 h-full w-full">
                <line
                  key={clickedGate.id + 'clicked'}
                  x1={from.x}
                  y1={from.y}
                  x2={mousePosition.x}
                  y2={mousePosition.y}
                  stroke="#34d399"
                  strokeWidth="2"
                />
              </svg>
            );
          })()}

        <svg className="pointer-events-none absolute left-0 top-0 h-full w-full">
          {pieces.map((gate) => {
            const from = getCellOutputPosition(
              gate.position.x,
              gate.position.y,
            );
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
        {Array.from({ length: 36 }, (_, index) => {
          const x = index % 6;
          const y = Math.floor(index / 6);
          const isSelected =
            clickedGate?.position.x === x && clickedGate?.position.y === y;

          return (
            <GridSquare
              key={`cell-${index}`}
              x={x}
              y={y}
              onDrop={handleDrop}
              className={isSelected ? 'bg-white/20' : ''}
              cellScale={cellScale}
            >
              {renderCellContent(x, y)}
            </GridSquare>
          );
        })}
      </div>
    </div>
  );
};

export default GridCircuit;
