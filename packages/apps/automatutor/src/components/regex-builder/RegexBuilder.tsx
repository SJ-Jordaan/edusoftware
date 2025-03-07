import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '../../hooks';
import { operatorOptions } from '../../pages/admin/common/symbols';

interface RegexBuilderProps {
  alphabet: string[];
  operators: string[];
  answer: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
}

// Regex validation errors
interface ValidationError {
  message: string;
  position?: number;
}

export const RegexBuilder = ({
  alphabet,
  operators,
  answer: regex,
  onChange,
}: RegexBuilderProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [validationError, setValidationError] =
    useState<ValidationError | null>(null);
  const [isValid, setIsValid] = useState(true);

  // Debounce validation for performance
  const debouncedRegex = useDebounce(regex, 1000);

  const unionSymbol = operatorOptions[0]; // '∪'
  const kleeneStar = operatorOptions[1]; // '*'
  const openParen = operatorOptions[2]; // '('
  const closeParen = operatorOptions[3]; // ')'

  // Validate regex syntax
  useEffect(() => {
    if (debouncedRegex === '') {
      setIsValid(true);
      setValidationError(null);
      return;
    }

    const result = validateRegex(debouncedRegex, alphabet);
    setIsValid(result.valid);
    setValidationError(result.valid ? null : result.error);
  }, [debouncedRegex, alphabet]);

  // Function to validate regex syntax
  const validateRegex = (
    expression: string,
    validSymbols: string[],
  ): { valid: boolean; error: ValidationError | null } => {
    // Create a set of valid alphabet symbols for quick lookup
    const validSymbolsSet = new Set(validSymbols);

    // Track parentheses for matching
    const parenStack: number[] = [];

    // Last character for operator placement validation
    let lastChar = '';

    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];

      // Check for valid symbols
      if (
        char !== openParen &&
        char !== closeParen &&
        char !== kleeneStar &&
        char !== unionSymbol &&
        !validSymbolsSet.has(char)
      ) {
        return {
          valid: false,
          error: {
            message: `Invalid symbol '${char}'`,
            position: i,
          },
        };
      }

      // Check parentheses matching
      if (char === openParen) {
        parenStack.push(i);
      } else if (char === closeParen) {
        if (parenStack.length === 0) {
          return {
            valid: false,
            error: {
              message:
                'Closing parenthesis without matching opening parenthesis',
              position: i,
            },
          };
        }
        parenStack.pop();
      }

      // Check for * operator usage
      if (char === kleeneStar) {
        if (
          i === 0 ||
          lastChar === unionSymbol ||
          lastChar === openParen ||
          lastChar === kleeneStar
        ) {
          return {
            valid: false,
            error: {
              message: '* operator must follow a symbol or )',
              position: i,
            },
          };
        }
      }

      // Check for U operator usage
      if (char === unionSymbol) {
        if (
          i === 0 ||
          i === expression.length - 1 ||
          lastChar === unionSymbol ||
          lastChar === openParen
        ) {
          return {
            valid: false,
            error: {
              message: 'Union operator must be between valid expressions',
              position: i,
            },
          };
        }
      }

      lastChar = char;
    }

    // Check for unmatched opening parentheses
    if (parenStack.length > 0) {
      return {
        valid: false,
        error: {
          message: 'Unclosed opening parenthesis',
          position: parenStack[0],
        },
      };
    }

    return { valid: true, error: null };
  };

  const handleAddition = (
    event: MouseEvent<HTMLButtonElement>,
    symbol: string,
  ) => {
    event.preventDefault();
    setActiveKey(symbol);
    setTimeout(() => setActiveKey(null), 200);

    if (!inputRef.current) return;

    const selectionStart = inputRef.current.selectionStart ?? 0;
    const newRegex =
      regex.slice(0, selectionStart) + symbol + regex.slice(selectionStart);

    onChange({ target: { name: 'answer', value: newRegex } });

    // Set focus and cursor position
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const newPosition = selectionStart + symbol.length;
        inputRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 10);
  };

  const handleBackspace = () => {
    setActiveKey('backspace');
    setTimeout(() => setActiveKey(null), 200);

    if (!inputRef.current) {
      return;
    }

    const selectionStart = inputRef.current.selectionStart ?? 0;

    if (selectionStart === 0) {
      return;
    }

    const newRegex =
      regex.slice(0, selectionStart - 1) + regex.slice(selectionStart);
    onChange({ target: { name: 'answer', value: newRegex } });

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const newPosition = selectionStart - 1;
        inputRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 10);
  };

  const handleClear = () => {
    setActiveKey('clear');
    setTimeout(() => setActiveKey(null), 200);
    onChange({ target: { name: 'answer', value: '' } });

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 10);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event);
  };

  const handleInputFocus = () => {
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  // Modified highlighting function - now returns array of colored characters
  const getHighlightedParts = () => {
    if (!regex) return [{ text: '', className: '' }];

    return regex.split('').map((char, index) => {
      let className = '';

      if (alphabet.includes(char)) {
        className = 'text-green-400'; // alphabet symbols
      } else if (char === openParen || char === closeParen) {
        className = 'text-blue-300'; // parentheses
      } else if (char === kleeneStar) {
        className = 'text-yellow-300'; // Kleene star
      } else if (char === unionSymbol) {
        className = 'text-purple-400'; // Union operator
      }

      // Highlight error position
      if (validationError?.position === index) {
        className += ' bg-red-900/50 rounded';
      }

      return { text: char, className };
    });
  };

  return (
    <section className="flex h-full w-full flex-col gap-3 pt-2">
      {/* Compact Input Display with Fixed Layout */}
      {/* Input Display with Fixed Space for Error Message */}
      <div
        className={`
    mb-2 rounded-xl bg-gray-800 px-4 py-2 shadow-inner transition-colors duration-300 ease-in-out
    ${
      isEditing
        ? 'ring-2 ring-indigo-500'
        : isValid
          ? regex.length > 0
            ? 'ring-1 ring-green-500'
            : 'ring-1 ring-gray-700'
          : 'ring-1 ring-red-500'
    }
  `}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Header with validation indicator */}
        <div className="mb-1 flex h-5 items-center justify-between">
          <span className="text-xs font-medium text-gray-400">Expression</span>
          {regex.length > 0 && (
            <div className="flex items-center">
              {isValid ? (
                <span className="flex items-center text-xs text-green-400">
                  <CheckCircleIcon className="mr-1 h-3 w-3" /> Valid
                </span>
              ) : (
                <span className="flex items-center text-xs text-red-400">
                  <XCircleIcon className="mr-1 h-3 w-3" /> Invalid
                </span>
              )}
            </div>
          )}
        </div>

        {/* Expression input with highlighting */}
        <div className="relative mb-2 h-8">
          {/* Syntax highlighting backdrop */}
          <div className="absolute inset-0 flex items-center overflow-x-auto whitespace-nowrap">
            {regex.length > 0 ? (
              getHighlightedParts().map((part, idx) => (
                <span key={idx} className={part.className}>
                  {part.text}
                </span>
              ))
            ) : (
              <span className="text-gray-500">Type or select symbols...</span>
            )}
          </div>

          {/* Invisible input on top */}
          <input
            ref={inputRef}
            className="absolute inset-0 w-full appearance-none bg-transparent text-transparent caret-indigo-400 focus:outline-none"
            autoFocus
            type="text"
            name="regex"
            value={regex}
            autoComplete="off"
            onChange={handleChange}
            spellCheck="false"
            inputMode="none"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            aria-label="Regular expression input"
          />

          {/* Cursor indicator */}
          <div
            className={`absolute right-0 top-0 h-8 w-0.5 bg-indigo-400 transition-opacity duration-500 ${isEditing ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>

        {/* Error message - fixed height space */}
        {/* <div className="min-h-[24px] text-xs">
          {validationError && (
            <div className="rounded bg-red-500/10 px-2 py-1 text-red-400">
              <span className="font-medium">Error:</span>{' '}
              {validationError.message}
            </div>
          )}
        </div> */}
      </div>

      {/* Function Buttons Row - standalone without alphabet */}
      <div className="mb-2 flex justify-between">
        <button
          className={`
            group flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 transition-all duration-150 
            ${regex.length === 0 ? 'opacity-50' : 'hover:bg-red-500/20 active:scale-95'} 
            ${activeKey === 'clear' ? 'scale-95 bg-red-500/30' : ''}
          `}
          disabled={regex.length === 0}
          onClick={handleClear}
          aria-label="Clear all"
        >
          <svg
            className="h-5 w-5 fill-red-400 transition-transform group-hover:scale-110 group-disabled:fill-red-800"
            viewBox="0 0 24 24"
          >
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>

        <button
          className={`
            group flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 transition-all duration-150
            ${regex.length === 0 ? 'opacity-50' : 'hover:bg-amber-500/20 active:scale-95'}
            ${activeKey === 'backspace' ? 'scale-95 bg-amber-500/30' : ''}
          `}
          disabled={regex.length === 0}
          onClick={handleBackspace}
          aria-label="Backspace"
        >
          <svg
            className="h-5 w-5 fill-amber-400 transition-transform group-hover:scale-110 group-disabled:fill-amber-800"
            viewBox="0 0 24 24"
          >
            <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z" />
          </svg>
        </button>
      </div>

      {/* Alphabet Section - now below function buttons with larger buttons */}
      <div className="rounded-xl bg-gray-800/50">
        <div className="mb-2 text-xs font-medium text-gray-400">Alphabet</div>
        <div className="flex flex-wrap gap-1">
          {alphabet.map((symbol) => (
            <button
              key={symbol}
              className={`
          flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-b from-gray-700 to-gray-800
          text-xl font-medium text-white shadow-md transition-all duration-150 hover:opacity-80
          active:scale-95 active:shadow-inner
          ${activeKey === symbol ? 'scale-95 shadow-inner' : ''}
        `}
              onClick={(e) => handleAddition(e, symbol)}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-gray-800/50">
        <div className="mb-2 text-xs font-medium text-gray-400">Operators</div>
        <div className="flex flex-wrap gap-1">
          {operators.map((operator) => (
            <button
              key={operator}
              className={`
          flex h-12 w-12 items-center justify-center rounded-lg
          ${
            operator === kleeneStar
              ? 'bg-gradient-to-b from-yellow-800/50 to-yellow-900/50'
              : operator === unionSymbol
                ? 'bg-gradient-to-b from-purple-800/50 to-purple-900/50'
                : 'bg-gradient-to-b from-blue-800/50 to-blue-900/50'
          }
          text-xl font-medium text-white shadow-md transition-all duration-150 
          hover:opacity-80 active:scale-95 active:shadow-inner
          ${activeKey === operator ? 'scale-95 shadow-inner' : ''}
        `}
              onClick={(e) => handleAddition(e, operator)}
            >
              {operator}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
