import { Fragment } from 'react';
import { useDrag } from 'react-dnd';
import { automataTypes } from '@edusoftware/core/src/types/GridAutomaton';
import { ARROW_PIECES } from './ArrowPieces';
import { Transition } from '@edusoftware/core/src/types/GridAutomaton';

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
      className={`flex h-full w-full items-center justify-center opacity-${
        isDragging ? '50' : '100'
      }`}
      style={{ width: '56px', height: '56px' }}
    >
      <svg width={56} height={56} viewBox={'0 0 56 56'}>
        {arrows.map((arrow, index) => {
          const { startSide, endSide, symbols } = arrow;
          const label = symbols.join(',');
          const key = `${startSide}-${endSide}`;
          const { pathD, polygonPoints, textPosition } = ARROW_PIECES[key];

          return (
            <Fragment key={`${index}-${key}-${label}`}>
              <path
                stroke="white"
                fill="none"
                strokeWidth="1"
                id={`path-${id}-${index}`}
                d={pathD}
              />

              <polygon points={polygonPoints} fill="white" />
              <text
                x={textPosition?.x}
                y={textPosition?.y}
                transform={`rotate(${textPosition?.rotate || 0}, ${
                  textPosition?.x
                }, ${textPosition?.y})`}
                key={`${index}-${key}-${label}-text-${startSide}-${endSide}`}
                fill="white"
                fontSize="14"
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
