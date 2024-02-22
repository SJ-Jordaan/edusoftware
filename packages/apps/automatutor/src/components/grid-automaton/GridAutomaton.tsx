import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { DraggableState } from './DraggableState';
import { GridCell } from './GridCell';
import { DraggableTransition } from './DraggableTransition';
import { Piece, PieceType } from './algorithms';

interface GridAutomatonProps {
  pieces: Piece[];
  onStateClick: (stateId: string) => void;
  onTransitionClick: (transitionId: string) => void;
  onDrop: (item: Piece, x: number, y: number, type: PieceType) => void;
  isEdit?: boolean;
}

const GridAutomaton = ({
  pieces,
  onStateClick,
  onTransitionClick,
  onDrop,
  isEdit,
}: GridAutomatonProps) => {
  const renderCellContent = (x: number, y: number) => {
    const cellContent = pieces.find(
      (element) => element.position.x === x && element.position.y === y,
    );
    if (!cellContent) return null;

    switch (cellContent.type) {
      case 'state':
        return (
          <DraggableState
            id={cellContent.id}
            key={`state-${cellContent.id}`}
            isFinal={cellContent.isFinal}
            isStart={cellContent.isStart}
            onClick={() => onStateClick(cellContent.id)}
          />
        );
      case 'transition':
        return (
          <DraggableTransition
            key={`transition-${cellContent.id}-${cellContent.transitions[0].startSide}-${cellContent.transitions[0].endSide}`}
            id={cellContent.id}
            arrows={cellContent.transitions}
            onClick={() => onTransitionClick(cellContent.id)}
          />
        );
      default:
        return null;
    }
  };

  if (isEdit) {
    return (
      <div className="relative">
        <div className="grid grid-cols-[repeat(6,_3.5rem)] items-center justify-center">
          {Array.from({ length: 36 }, (_, index) => (
            <GridCell
              key={`cell-${index}`}
              x={index % 6}
              y={Math.floor(index / 6)}
              onDrop={onDrop}
            >
              {renderCellContent(index % 6, Math.floor(index / 6))}
            </GridCell>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={TouchBackend}>
      <div className="relative">
        <div className="grid grid-cols-[repeat(6,_3.5rem)] items-center justify-center">
          {Array.from({ length: 36 }, (_, index) => (
            <GridCell
              key={`cell-${index}`}
              x={index % 6}
              y={Math.floor(index / 6)}
              onDrop={onDrop}
            >
              {renderCellContent(index % 6, Math.floor(index / 6))}
            </GridCell>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default GridAutomaton;
