import { useDrop } from 'react-dnd';
import {
  Piece,
  PieceType,
  automataTypes,
} from '@edusoftware/core/src/types/GridAutomaton';

interface GridCellProps {
  x: number;
  y: number;
  onDrop: (item: Piece, x: number, y: number, type: PieceType) => void;
  children: React.ReactNode;
}

export const GridCell = ({ x, y, onDrop, children }: GridCellProps) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: [automataTypes.STATE, automataTypes.TRANSITION],
    drop: (item: Piece, monitor) =>
      onDrop(item, x, y, monitor.getItemType() as PieceType),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`box-border flex h-14 w-14 flex-col items-center justify-center justify-self-center border border-gray-700 ${
        isOver && canDrop ? 'bg-green-100' : ''
      }`}
    >
      {children}
    </div>
  );
};
