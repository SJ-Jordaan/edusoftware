import { GridCell } from './GridCell';

import { useAppDispatch, useAppSelector } from '../../store';
import { DraggableGate } from './DraggableGate';
import {
  Gate,
  moveOrAddPiece,
} from '../grid-automaton-builder/gridCircuitSlice';
import { GateType } from './LogicGates';

const GridCircuit = () => {
  const dispatch = useAppDispatch();
  const pieces = useAppSelector((state) => state.gridCircuit.pieces);

  //   const handleStateClick = (id: string) => {
  //     dispatch(toggleFinalState(id));
  //   };

  //   const handleRotate = (id: string) => {
  //     dispatch(rotateTransition(id));
  //   };

  const handleDrop = (item: Gate, x: number, y: number, type: GateType) => {
    dispatch(moveOrAddPiece(item, x, y, type));
    console.log('DROPPED', item, x, y, type);
  };

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
        onClick={() => console.log('Click')}
      />
    );
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-[repeat(6,_7rem)] items-center justify-center">
        {Array.from({ length: 36 }, (_, index) => (
          <GridCell
            key={`cell-${index}`}
            x={index % 6}
            y={Math.floor(index / 6)}
            onDrop={handleDrop}
          >
            {renderCellContent(index % 6, Math.floor(index / 6))}
          </GridCell>
        ))}
      </div>
    </div>
  );
};

export default GridCircuit;
