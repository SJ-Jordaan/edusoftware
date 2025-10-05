import { Alphabet, Piece, Side, StatePiece, TransitionPiece } from '../types';

export function shouldUseStraightPath(startSide: Side, endSide: Side) {
  const oppositeSides =
    (startSide === 'left' && endSide === 'right') ||
    (startSide === 'right' && endSide === 'left') ||
    (startSide === 'top' && endSide === 'bottom') ||
    (startSide === 'bottom' && endSide === 'top');
  return oppositeSides;
}

export function generateSelfLoopPath(size: number, startSide: Side) {
  const scale = size / 10;

  switch (startSide) {
    case 'top':
      return `M ${7 * scale} 0 C ${9 * scale} ${scale} ${10 * scale} ${
        6 * scale
      } ${5 * scale} ${6 * scale} C 0 ${6 * scale} ${scale} ${scale} ${
        3 * scale
      } 0`;
    case 'right':
      return `M ${size} ${7 * scale} C ${9 * scale} ${9 * scale} ${4 * scale} ${
        10 * scale
      } ${4 * scale} ${5 * scale} C ${4 * scale} 0 ${9 * scale} ${scale} ${
        10 * scale
      } ${3 * scale}`;
      break;
    case 'bottom':
      return `M ${3 * scale} ${size} C ${scale} ${9 * scale} 0 ${4 * scale} ${
        5 * scale
      } ${4 * scale} C ${10 * scale} ${4 * scale} ${9 * scale} ${9 * scale} ${
        7 * scale
      } ${10 * scale}`;
    case 'left':
      return `M 0 ${3 * scale} C ${scale} ${scale} ${6 * scale} 0 ${
        6 * scale
      } ${5 * scale} C ${6 * scale} ${10 * scale} ${1 * scale} ${9 * scale} 0 ${
        7 * scale
      }`;
    default:
      return 'M 0 0';
  }
}

export const createPieces = (
  alphabet: Alphabet | undefined,
): Partial<Piece>[] => {
  if (!alphabet) return [];

  // Convert the alphabet object to an array of enabled symbols
  const alphabetArray = getEnabledSymbols(alphabet);

  // Initialize pieces with starting state pieces
  const pieces: Partial<Piece>[] = createInitialStatePieces();

  // Generate all combinations of the alphabet symbols
  const symbolCombinations = getAllSymbolCombinations(alphabetArray);

  // Add transition pieces for each combination of symbols
  symbolCombinations.forEach((combination) => {
    pieces.push(...createTransitionPieces(combination.split('')));
  });

  return pieces;
};

export const getEnabledSymbols = (alphabet: Alphabet): string[] => {
  return Object.keys(alphabet).filter((symbol) => alphabet[symbol]);
};

export const createInitialStatePieces = (): Partial<StatePiece>[] => {
  return [
    { type: 'state', isFinal: false, isStart: true },
    { type: 'state', isFinal: false, isStart: false },
  ];
};

export const createTransitionPieces = (
  symbols: string[],
): Partial<TransitionPiece>[] => {
  return [
    {
      type: 'transition',
      transitions: [{ symbols: symbols, startSide: 'left', endSide: 'right' }],
    },
    {
      type: 'transition',
      transitions: [{ symbols: symbols, startSide: 'bottom', endSide: 'left' }],
    },
    {
      type: 'transition',
      transitions: [
        { symbols: symbols, startSide: 'bottom', endSide: 'right' },
      ],
    },
    {
      type: 'transition',
      transitions: [
        { symbols: symbols, startSide: 'bottom', endSide: 'bottom' },
      ],
    },
  ];
};

export const getAllSymbolCombinations = (symbols: string[]): string[] => {
  const combinations: string[] = [];

  // Generate all non-repeating combinations of symbols
  const generateCombinations = (prefix: string, symbols: string[]) => {
    for (let i = 0; i < symbols.length; i++) {
      const newPrefix = prefix + symbols[i];
      combinations.push(newPrefix);
      generateCombinations(newPrefix, symbols.slice(i + 1));
    }
  };

  generateCombinations('', symbols);
  return combinations;
};
