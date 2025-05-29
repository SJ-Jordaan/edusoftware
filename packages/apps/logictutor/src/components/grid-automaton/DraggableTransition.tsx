import { Fragment } from 'react';
import { useDrag } from 'react-dnd';
import { automataTypes } from '@edusoftware/core/src/types/GridAutomaton';
import { Transition } from '@edusoftware/core/src/types/GridAutomaton';
import { getArrowCalculator, CELL_SIZE } from './utils/ArrowMath';

interface DraggableTransitionProps {
  id?: string;
  arrows: Transition[];
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const DraggableTransition = ({
  id,
  arrows,
  onClick,
}: DraggableTransitionProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: automataTypes.TRANSITION,
    item: { id, transitions: arrows },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      onClick={(e) => onClick?.(e)}
      className={`flex h-full w-full items-center justify-center transition-all duration-200 hover:scale-110 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      style={{ width: `${CELL_SIZE}px`, height: `${CELL_SIZE}px` }}
    >
      <svg
        width={CELL_SIZE}
        height={CELL_SIZE}
        viewBox={`0 0 ${CELL_SIZE} ${CELL_SIZE}`}
        className="overflow-visible" // Allow arrows to overflow cell boundaries
      >
        {arrows.map((arrow, index) => {
          const { startSide, endSide, symbols } = arrow;
          const label = symbols.join(',');
          const key = `${startSide}-${endSide}`;

          // Get mathematically precise arrow parameters
          const calculator = getArrowCalculator(
            startSide as 'left' | 'right' | 'top' | 'bottom',
            endSide as 'left' | 'right' | 'top' | 'bottom',
          );

          const { path, arrowHead, labelPos } = calculator();

          return (
            <Fragment key={`${index}-${key}-${label}`}>
              {/* Path */}
              <path
                d={path}
                stroke="white"
                strokeWidth="2"
                fill="none"
                className="stroke-emerald-400"
              />

              {/* Arrow head */}
              <polygon
                points={arrowHead}
                fill="white"
                className="fill-emerald-400 stroke-emerald-400"
              />

              {/* Label */}
              <text
                x={labelPos.x}
                y={labelPos.y}
                transform={`rotate(${labelPos.rotate}, ${labelPos.x}, ${labelPos.y})`}
                fill="white"
                fontSize="12"
                textAnchor="middle"
                dominantBaseline="middle"
                className="select-none font-semibold"
              >
                {label}
              </text>
            </Fragment>
          );
        })}
      </svg>
    </div>
  );
};
