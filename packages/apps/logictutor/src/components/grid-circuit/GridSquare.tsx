import { useDrop } from 'react-dnd';
import { automataTypes } from '@edusoftware/core/src/types/GridAutomaton';
import { Gate } from './gridCircuitSlice';
import { GateType } from './LogicGates';

interface GridCellProps {
  x: number;
  y: number;
  onDrop: (item: Gate, x: number, y: number, type: GateType) => void;
  children: React.ReactNode;
  className?: string;
  cellScale: 1 | 2;
}

export const GridSquare = ({
  x,
  y,
  onDrop,
  children,
  className,
  cellScale,
}: GridCellProps) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: [automataTypes.STATE, automataTypes.TRANSITION],
    drop: (item: Gate, monitor) =>
      onDrop(item, x, y, monitor.getItemType() as GateType),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`${className ?? ''} box-border flex h-${cellScale * 14} w-${cellScale * 14} flex-col items-center justify-center justify-self-center border transition-all duration-200 ${
        isOver && canDrop
          ? 'border-emerald-400 bg-emerald-900/20'
          : 'border-slate-700 hover:border-slate-500'
      }`}
    >
      {children}
    </div>
  );
};
