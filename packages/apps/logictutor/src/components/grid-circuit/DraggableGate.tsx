import React from 'react';
import { useDrag } from 'react-dnd';
import { automataTypes } from '@edusoftware/core/src/types/GridAutomaton';
import { gateMap, GateType } from './LogicGates';

interface DraggableGateProps {
  id?: string;
  gateType: GateType;
  inputLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  isNew: boolean;
}

export const DraggableGate = ({
  id,
  gateType,
  inputLabel,
  onClick,
}: DraggableGateProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: automataTypes.STATE,
    item: { id, gateType, label: inputLabel },
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
      {gateMap(gateType, inputLabel)}
    </div>
  );
};
