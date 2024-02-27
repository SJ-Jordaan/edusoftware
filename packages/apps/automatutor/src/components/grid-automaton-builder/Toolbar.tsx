import { useAppSelector } from '../../store';
import { DraggableState } from '../grid-automaton/DraggableState';
import { DraggableTransition } from '../grid-automaton/DraggableTransition';
import { DummyCell } from './DummyCell';

export const Toolbar = () => {
  const toolbar = useAppSelector((state) => state.gridAutomaton.toolbar);

  return (
    <div className="flex flex-wrap gap-1">
      {toolbar.map((piece, index) => (
        <DummyCell key={`${piece.type}-${index}`}>
          {piece.type === 'state' && (
            <DraggableState
              isFinal={piece.isFinal ?? false}
              isStart={piece.isStart ?? false}
            />
          )}

          {piece.type === 'transition' && (
            <DraggableTransition arrows={piece.transitions ?? []} />
          )}
        </DummyCell>
      ))}
    </div>
  );
};
