import React from 'react';
import { useDrag } from 'react-dnd';
import { automataTypes } from '@edusoftware/core/src/types/GridAutomaton';

interface DraggableStateProps {
  id?: string;
  isFinal: boolean;
  isStart: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const DraggableState = ({
  id,
  isFinal,
  isStart,
  onClick,
}: DraggableStateProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: automataTypes.STATE,
    item: { id, isStart, isFinal },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      onClick={(e) => onClick?.(e)}
      className={`flex h-full w-full cursor-pointer items-center justify-center transition-all duration-200 ${
        isDragging ? 'scale-110 opacity-70' : 'hover:scale-110'
      }`}
    >
      {/* Outer circle - all states */}
      <div
        className={
          'flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400 bg-slate-800'
        }
      >
        {/* Inner circle - final states have double circle */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full border-emerald-400 bg-slate-800 text-sm font-medium text-white
          ${isFinal ? 'border' : ''}`}
        >
          {isStart && 'q₀'}
        </div>
      </div>
    </div>
  );
};
