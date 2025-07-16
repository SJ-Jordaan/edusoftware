import {
  generateTruthTable,
  infixToPostfix,
} from '@edusoftware/core/src/algorithms';
import { useMemo } from 'react';

interface CounterExampleProps {
  correctExpr: string;
  incorrectExpr: string;
  outputSymbol: string;
}
export const CounterExample = ({
  correctExpr,
  incorrectExpr,
  outputSymbol,
}: CounterExampleProps) => {
  let correctTable: string[][] = [];
  let incorrectTable: string[][] = [];

  for (const [index, boolExpr] of [
    infixToPostfix(correctExpr.split('')),
    incorrectExpr,
  ].entries()) {
    const table: string[][] = [];

    let inputGates: string[] = [];
    for (const char of boolExpr.split('')) {
      if (/^[a-zA-Z]$/.test(char)) inputGates.push(char);
    }

    inputGates = Array.from(new Set(inputGates)).sort((a, b) =>
      a.localeCompare(b),
    );

    table.push(inputGates);

    const numInputs = inputGates.length;
    const numTruth = 1 << numInputs;

    const truthTable = generateTruthTable(boolExpr);

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
    if (index === 0) correctTable = table;
    if (index === 1) incorrectTable = table;
  }

  const firstMismatchIndex = useMemo(() => {
    // Start from index 1 to skip headers
    for (
      let i = 1;
      i < Math.min(correctTable.length, incorrectTable.length);
      i++
    ) {
      const correctRow = correctTable[i];
      const incorrectRow = incorrectTable[i];

      // Check if rows have different lengths or different values
      if (correctRow.length !== incorrectRow.length) {
        return i;
      }

      for (let j = 0; j < correctRow.length; j++) {
        if (correctRow[j] !== incorrectRow[j]) {
          return i;
        }
      }
    }

    // If no mismatch found, return -1
    return -1;
  }, [correctTable, incorrectTable]);

  const renderTableRow = (row, rowIndex) => (
    <div
      key={rowIndex}
      className={`flex justify-around gap-4 px-4 py-1 ${
        rowIndex === 0 ? 'border-b border-gray-600 font-semibold' : ''
      }`}
    >
      {row.map((item, colIndex) => (
        <p
          key={colIndex}
          className={`w-12 text-center ${colIndex === row.length - 1 ? 'border-l border-gray-600' : ''}`}
        >
          {item}
        </p>
      ))}
    </div>
  );

  if (correctTable.length !== incorrectTable.length)
    return (
      <div className="rounded-lg bg-gray-800/70 p-4 font-mono text-sm text-white shadow-lg backdrop-blur-sm transition-all hover:bg-gray-800">
        <p>
          ❗You are not using all of the required input gates in your solution
        </p>
      </div>
    );

  // Render the component
  return (
    <div className="flex flex-col rounded-lg bg-gray-800/70 p-4 font-mono text-sm text-white shadow-lg backdrop-blur-sm transition-all hover:bg-gray-800">
      <p className="mb-2 text-base font-bold">Counter Example</p>
      <p className="mb-2 font-medium text-green-600">✅ Target Output:</p>

      {/* Always show header */}
      {correctTable.length > 0 && renderTableRow(correctTable[0], 0)}

      {/* Show first mismatched row if found */}
      {firstMismatchIndex !== -1 &&
        correctTable[firstMismatchIndex] &&
        renderTableRow(correctTable[firstMismatchIndex], firstMismatchIndex)}

      <p className="mb-2 font-medium text-blue-600">📝 Your Output:</p>
      {/* Always show header */}
      {incorrectTable.length > 0 && renderTableRow(incorrectTable[0], 0)}

      {/* Show first mismatched row if found */}
      {firstMismatchIndex !== -1 &&
        incorrectTable[firstMismatchIndex] &&
        renderTableRow(incorrectTable[firstMismatchIndex], firstMismatchIndex)}
    </div>
  );
};
