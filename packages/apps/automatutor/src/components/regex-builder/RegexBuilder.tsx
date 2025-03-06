import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import Backspace from '../../assets/backspace-icon.svg?react';
import RecycleBin from '../../assets/recycle-bin-icon.svg?react';

interface RegexBuilderProps {
  alphabet: string[];
  operators: string[];
  answer: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
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

  useEffect(() => {
    onChange({ target: { name: 'answer', value: regex } });
  }, [regex]);

  const handleAddition = (
    event: MouseEvent<HTMLButtonElement>,
    symbol: string,
  ) => {
    event.preventDefault();
    setActiveKey(symbol);

    setTimeout(() => setActiveKey(null), 200);

    if (!inputRef.current) {
      return;
    }

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

  return (
    <section className="flex h-full w-full flex-col gap-3">
      {/* Enhanced Input Display */}
      <div
        className={`
          relative mb-2 rounded-xl bg-gray-800 px-4 py-3 shadow-inner transition-all duration-300 ease-in-out
          ${isEditing ? 'ring-2 ring-indigo-500' : 'ring-1 ring-gray-700'}
        `}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="mb-1 text-xs font-medium text-gray-400">Expression</div>
        <div className="scrollbar-hide flex items-center overflow-x-auto whitespace-nowrap">
          <input
            ref={inputRef}
            className="w-full appearance-none bg-transparent py-1 text-right text-3xl font-light tracking-wide text-white caret-indigo-400 focus:outline-none"
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
          <div
            className={`ml-2 h-6 w-0.5 bg-indigo-400 transition-opacity duration-500 ${isEditing ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      </div>

      {/* Function Buttons */}
      <div className="flex justify-between gap-2">
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
          <RecycleBin className="h-5 w-5 fill-red-400 transition-transform group-hover:scale-110 group-disabled:fill-red-800" />
        </button>

        {/* Character Counter */}
        <div className="flex items-center rounded-lg bg-gray-800 px-3 py-1">
          <span className="text-sm font-medium text-gray-400">
            {regex.length} <span className="text-xs">chars</span>
          </span>
        </div>

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
          <Backspace className="h-5 w-5 fill-amber-400 transition-transform group-hover:scale-110 group-disabled:fill-amber-800" />
        </button>
      </div>

      {/* Alphabet Section with improved responsive grid */}
      <div className="rounded-xl bg-gray-800/50">
        <div className="mb-2 text-xs font-medium text-gray-400">Alphabet</div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {alphabet.map((symbol, index) => (
            <button
              key={index}
              className={`
                flex h-12 w-full items-center justify-center rounded-lg bg-gradient-to-b from-gray-700 to-gray-800 
                text-xl font-medium text-white shadow-md transition-all duration-150 hover:from-indigo-600 hover:to-indigo-700 
                active:scale-95 active:shadow-inner
                ${activeKey === symbol ? 'scale-95 from-indigo-600 to-indigo-700 shadow-inner' : ''}
              `}
              onClick={(e) => handleAddition(e, symbol)}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Operators Section */}
      <div className="rounded-xl bg-gray-800/50">
        <div className="mb-2 text-xs font-medium text-gray-400">Operators</div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9">
          {operators.map((operator, index) => (
            <button
              key={index}
              className={`
                flex h-12 w-full items-center justify-center rounded-lg bg-gradient-to-b from-gray-600 to-gray-700
                text-xl font-medium text-white shadow-md transition-all duration-150 hover:from-blue-600 hover:to-blue-700 
                active:scale-95 active:shadow-inner
                ${activeKey === operator ? 'scale-95 from-blue-600 to-blue-700 shadow-inner' : ''}
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
