import {
  generateTruthTable,
  infixToPostfix,
} from '@edusoftware/core/src/algorithms';

interface TruthTableProps {
  booleanExpression: string;
  outputSymbol: string;
}
export const TruthTable = ({
  booleanExpression,
  outputSymbol,
}: TruthTableProps) => {
  const table: string[][] = [];

  let inputGates: string[] = [];
  for (const char of booleanExpression.split('')) {
    if (/^[a-zA-Z]$/.test(char)) inputGates.push(char);
  }

  inputGates = Array.from(new Set(inputGates)).sort((a, b) =>
    a.localeCompare(b),
  );

  table.push(inputGates);

  const numInputs = inputGates.length;
  const numTruth = 1 << numInputs;

  const truthTable = generateTruthTable(
    infixToPostfix(booleanExpression.split('')),
  );

  table[0].push(outputSymbol);

  for (let i = 0; i < numTruth; i++) {
    const inputMap: Record<string, boolean> = {};

    for (let j = 0; j < numInputs; j++) {
      const label = inputGates[j]!;
      inputMap[label] = !!(i & (1 << (numInputs - j - 1)));
    }

    const row: string[] = Object.entries(inputMap).map((value) =>
      value[1] ? '1' : '0',
    );
    row.push(truthTable[i]);

    table.push(row);
  }

  return (
    <div className="flex flex-col font-mono text-sm text-white">
      {table.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`flex justify-around gap-4 px-4 py-1 ${
            rowIndex === 0 ? 'border-b border-gray-600 font-semibold' : ''
          }`}
        >
          {row.map((item, colIndex) => (
            <p key={colIndex} className="w-12 text-center">
              {item}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};
