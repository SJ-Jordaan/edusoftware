import { Piece } from '@edusoftware/core/src/types/GridAutomaton';

export const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};

export const handleRandomiseCoordinates = (elements: Piece[]) => {
  const allCoordinates = Array.from({ length: 36 }, (_, index) => [
    index % 6,
    Math.floor(index / 6),
  ]);

  const shuffledCoordinates: number[][] = shuffleArray(allCoordinates);

  return JSON.stringify(
    elements.map((element, index) => {
      const [x, y] = shuffledCoordinates[index];
      return { ...element, position: { x, y } };
    }),
  );
};
