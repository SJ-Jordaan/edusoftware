import { useEffect } from 'react';
import { Alphabet } from '@edusoftware/core/src/types/GridAutomaton';
import { TrashBin } from './TrashBin';
import GridAutomaton from '../grid-automaton/GridAutomaton';
import { useAppDispatch } from '../../store';
import { initGrid, initToolbar } from './gridAutomaton.slice';
import { Toolbar } from './Toolbar';

interface BuilderProps {
  answer: string;
  alphabet?: Alphabet;
  isEditable?: boolean;
}

export const GridAutomatonBuilder = ({
  answer,
  alphabet,
  isEditable,
}: BuilderProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initToolbar(alphabet));
  }, [dispatch, alphabet]);

  useEffect(() => {
    dispatch(initGrid(answer));
  }, [dispatch, answer]);

  return (
    <div className="flex flex-col">
      <GridAutomaton />

      {isEditable && (
        <>
          <TrashBin />
          <Toolbar />
        </>
      )}
    </div>
  );
};
