import { useDrop } from 'react-dnd';
import RecycleBin from '../../assets/recycle-bin-icon.svg?react';
import {
  Piece,
  automataTypes,
} from '@edusoftware/core/src/types/GridAutomaton';

interface TrashBinProps {
  onItemDropped: (item: Piece, itemType: unknown) => void;
}

export const TrashBin = ({ onItemDropped }: TrashBinProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [automataTypes.STATE, automataTypes.TRANSITION],
    drop: (item: Piece, monitor) => onItemDropped(item, monitor.getItemType()),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={'mb-2 flex h-12 w-full items-center justify-center'}
    >
      <div
        className={`flex h-full w-32 items-center justify-center rounded-full  transition-colors duration-300 ${
          isOver ? 'animate-pulse bg-red-500' : ''
        } relative`}
      >
        <RecycleBin
          className={`h-6 w-6 ${
            isOver ? 'fill-current text-white' : 'fill-red-400'
          } transform transition-transform duration-300 ${
            isOver ? 'scale-125' : 'scale-100'
          }`}
        />
      </div>
    </div>
  );
};
