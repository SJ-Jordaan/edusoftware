import { useState, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { TruthTable } from './TruthTable';

interface Question {
  showTruthTable: boolean;
  booleanExpression: string;
  outputSymbol: string;
}

interface QuestionInfoProps {
  collapsedDefault: boolean;
  question: Question;
}

export const QuestionInfo = ({
  collapsedDefault,
  question,
}: QuestionInfoProps) => {
  const [isCollapsed, setIsCollapsed] = useState(() => collapsedDefault);
  const contentRef = useRef<HTMLDivElement>(null);

  function normalizeBoolExpr(expr: string): string {
    const map: Record<string, string> = {
      '.': '·',
      '&': '·',
      '^': '⊕',
      '|': '+',
    };

    // Replace operators first (but leave ! for now)
    expr = expr.replace(/[.&^|]/g, (match) => map[match]);

    // Handle NOT (!) by moving it to postfix
    function processNot(input: string): string {
      let out = '';
      let i = 0;

      while (i < input.length) {
        if (input[i] === '!') {
          i++;
          if (input[i] === '(') {
            // Find the matching closing parenthesis
            let depth = 1;
            let subExpr = '';
            i++; // skip '('
            while (i < input.length && depth > 0) {
              if (input[i] === '(') depth++;
              else if (input[i] === ')') depth--;
              if (depth > 0) {
                subExpr += input[i];
              }
              i++;
            }
            out += `(${processNot(subExpr)})'`;
          } else {
            out += `${input[i]}'`;
            i++;
          }
        } else if (input[i] === '(') {
          let depth = 1;
          let subExpr = '';
          i++; // skip '('
          while (i < input.length && depth > 0) {
            if (input[i] === '(') depth++;
            else if (input[i] === ')') depth--;
            if (depth > 0) {
              subExpr += input[i];
            }
            i++;
          }
          out += '(' + processNot(subExpr) + ')';
        } else {
          out += input[i];
          i++;
        }
      }

      return out;
    }

    return processNot(expr);
  }

  return (
    <div className="rounded-lg bg-gray-800/70 shadow-lg backdrop-blur-sm transition-all hover:bg-gray-800">
      <div
        className="flex cursor-pointer items-center justify-between rounded-lg p-4 hover:bg-gray-700"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="flex items-center text-sm font-medium text-indigo-400">
          <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-xs">
            i
          </span>
          Question Info
        </h3>
        <ChevronDownIcon
          className={`${isCollapsed ? 'rotate-180' : ''} h-5 w-5 text-indigo-400 transition-transform duration-300`}
        />
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
        }`}
      >
        <div ref={contentRef} className="p-4">
          <div>
            <h4 className="mb-2 text-base font-medium text-gray-400">
              {question.showTruthTable ? 'Truth Table' : 'Boolean Expression'}
            </h4>
            {question.showTruthTable ? (
              <TruthTable
                booleanExpression={question.booleanExpression}
                outputSymbol={question.outputSymbol}
              />
            ) : (
              <div className="flex flex-wrap items-center rounded-lg text-base text-white shadow-inner transition-transform">
                {`${normalizeBoolExpr(question.booleanExpression)} = ${question.outputSymbol}`
                  .split('')
                  .filter((char) => !/[\s]/g.test(char))
                  .join(' ')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
