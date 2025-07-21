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
      className={`box-border flex h-14 w-14 flex-col items-center justify-center justify-self-center border transition-all duration-200 ${
        isOver && canDrop
          ? 'border-emerald-400 bg-emerald-900/20'
          : 'border-slate-700 hover:border-slate-500'
      }`}
    >
      {children}
    </div>
  );
};
