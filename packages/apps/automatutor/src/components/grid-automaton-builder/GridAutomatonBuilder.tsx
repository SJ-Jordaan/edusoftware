import { useEffect, useMemo, useState } from 'react';
import { createPieces } from '../grid-automaton/algorithms';
import {
  Alphabet,
  Piece,
  PieceType,
  Side,
} from '@edusoftware/core/src/types/GridAutomaton';
import { DraggableState } from '../grid-automaton/DraggableState';
import { DraggableTransition } from '../grid-automaton/DraggableTransition';
import { DummyCell } from './DummyCell';
import { TrashBin } from './TrashBin';
import { v4 as uuidv4 } from 'uuid';
import GridAutomaton from '../grid-automaton/GridAutomaton';

interface GridAutomatonBuilderProps {
  answer: string;
  alphabet?: Alphabet;
  onChange: (e: { target: { name: string; value: string } }) => void;
  isEdit?: boolean;
}

const safeParse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

export const GridAutomatonBuilder = ({
  answer,
  alphabet,
  onChange,
  isEdit,
}: GridAutomatonBuilderProps) => {
  const pieces = useMemo(() => isEdit && createPieces(alphabet), [alphabet]);

  const parsedAnswer = safeParse(answer);
  const initialAnswer: Piece[] = !parsedAnswer
    ? [
        {
          id: 'start',
          type: 'state',
          position: { x: 0, y: 0 },
          isFinal: false,
          isStart: true,
          label: 'start',
        },
      ]
    : parsedAnswer;

  const [automaton, setAutomaton] = useState<Piece[]>(initialAnswer);

  useEffect(() => {
    console.log('Automaton changed:', automaton);
    const serializedAutomaton = JSON.stringify(automaton);
    onChange({
      target: { name: 'answer', value: serializedAutomaton },
    });
  }, [automaton]);

  const handleDelete = (item: Piece) => {
    setAutomaton((prevAutomaton: Piece[]) => [
      ...prevAutomaton.filter((element) => element.id !== item.id),
    ]);
  };

  const handleStateClick = (stateId: string) => {
    if (!stateId) {
      return;
    }

    setAutomaton((prevAutomaton: Piece[]) => {
      const elements = prevAutomaton.map((element) => {
        if (element.id === stateId && element.type === 'state') {
          return { ...element, isFinal: !element.isFinal };
        }
        return element;
      });

      return [...elements];
    });
  };

  const handleRotate = (transitionId: string) => {
    if (!transitionId) return; // Guard clause if no transitionId is selected

    const rotateSide = (side: Side) => {
      const rotationMap: Record<Side, Side> = {
        top: 'right',
        right: 'bottom',
        bottom: 'left',
        left: 'top',
      };
      return rotationMap[side];
    };

    setAutomaton((prevAutomaton: Piece[]) => {
      const elements = prevAutomaton.map((element) => {
        if (element.id === transitionId && element.type === 'transition') {
          return {
            ...element,
            transitions: element.transitions.map((transition) => ({
              ...transition,
              startSide: rotateSide(transition.startSide),
              endSide: rotateSide(transition.endSide),
            })),
          };
        }
        return element;
      });

      return [...elements];
    });
  };

  const handleDrop = (item: Piece, x: number, y: number, type: PieceType) => {
    setAutomaton((prevAutomaton: Piece[]) => {
      const updatedElements = [...prevAutomaton];

      // Find the index of the element being moved
      const movingElementIndex = updatedElements.findIndex(
        (element) => element.id === item.id,
      );
      // Find the index of any element that might already be at the target position
      const targetElementIndex = updatedElements.findIndex(
        (element) => element.position.x === x && element.position.y === y,
      );

      if (targetElementIndex !== -1 && movingElementIndex !== -1) {
        // Swap positions if both elements are found
        const targetElement = updatedElements[targetElementIndex];
        const movingElement = updatedElements[movingElementIndex];

        updatedElements[movingElementIndex] = {
          ...movingElement,
          position: { ...targetElement.position },
        };
        updatedElements[targetElementIndex] = {
          ...targetElement,
          position: { ...movingElement.position },
        };
      } else if (movingElementIndex === -1) {
        updatedElements.push({
          ...item,
          type,
          position: { x, y },
          id: `${type}-${uuidv4()}`,
        } as Piece);

        return [...updatedElements];
      }

      // Move the element to the new position which is empty
      updatedElements[movingElementIndex] = {
        ...updatedElements[movingElementIndex],
        position: { x, y },
      };

      return [...updatedElements];
    });
  };

  return (
    <div className="flex flex-col">
      <GridAutomaton
        onStateClick={handleStateClick}
        pieces={automaton}
        onDrop={handleDrop}
        onTransitionClick={handleRotate}
        isEdit={isEdit}
      />

      {isEdit && pieces && (
        <>
          <TrashBin onItemDropped={handleDelete} />
          <div className="flex flex-wrap gap-1">
            {pieces.map((piece, index) => (
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
        </>
      )}
    </div>
  );
};
