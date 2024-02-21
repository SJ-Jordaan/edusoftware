import React from 'react';
import { useDrag } from 'react-dnd';
import { automataTypes } from './algorithms';

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
      className={`flex h-full w-full items-center justify-center rounded-full border p-1 text-white opacity-${
        isDragging ? '50' : '100'
      }`}
    >
      <div
        className={`flex h-full w-full items-center justify-center rounded-full ${
          isFinal ? 'border' : 'border-none'
        }`}
      >
        {isStart && 'start'}
      </div>
    </div>
  );
};
