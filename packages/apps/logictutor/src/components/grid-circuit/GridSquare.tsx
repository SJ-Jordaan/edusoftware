import { useDrop } from 'react-dnd';
import { automataTypes } from '@edusoftware/core/src/types/GridAutomaton';
import { Gate } from './gridCircuitSlice';
import { GateType } from './LogicGates';

interface GridCellProps {
  x: number;
  y: number;
  onDrop: (
    item: Gate,
    x: number,
    y: number,
    type: GateType,
    label?: string,
  ) => void;
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
      onDrop(item, x, y, monitor.getItemType() as GateType, item.label),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`${className ?? ''} box-border flex flex-col items-center justify-center justify-self-center border transition-all duration-200 ${
        isOver && canDrop
          ? 'border-emerald-400 bg-emerald-900/20'
          : 'border-slate-700 hover:border-slate-500'
      }`}
      style={{
        height: `${cellScale * 14 * 0.25}rem`, // 0.25rem = 4px (Tailwind's base unit)
        width: `${cellScale * 14 * 0.25}rem`,
      }}
    >
      {children}
    </div>
  );
};
