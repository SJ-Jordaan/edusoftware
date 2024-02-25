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
  answer,
  onChange,
}: RegexBuilderProps) => {
  const [regex, setRegex] = useState(answer);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    onChange({ target: { name: 'answer', value: regex } });
  }, [regex]);

  const handleAddition = (
    event: MouseEvent<HTMLButtonElement>,
    symbol: string,
  ) => {
    event.preventDefault();

    if (!inputRef.current) {
      return;
    }

    const selectionStart = inputRef.current.selectionStart ?? 0;
    const newRegex =
      regex.slice(0, selectionStart) + symbol + regex.slice(selectionStart);

    setRegex(newRegex);

    // Wait for the state to update, then set the focus back to the input

    inputRef.current.focus();
    // Optional: Set cursor position right after the newly added symbol
    const newPosition = selectionStart + symbol.length;
    inputRef.current.setSelectionRange(newPosition, newPosition);
  };

  const handleBackspace = () => {
    if (!inputRef.current) {
      return;
    }

    const selectionStart = inputRef.current.selectionStart ?? 0;

    if (selectionStart === 0) {
      return;
    }

    const newRegex =
      regex.slice(0, selectionStart - 1) + regex.slice(selectionStart);
    setRegex(newRegex);

    inputRef.current.focus();
    // Optional: Adjust cursor position after deletion
    const newPosition = selectionStart - 1;
    inputRef.current.setSelectionRange(newPosition, newPosition);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRegex(event.target.value);
  };

  return (
    <section className="relative flex h-full w-full flex-col gap-4 py-4">
      <input
        ref={inputRef}
        className="h-12 w-full appearance-none bg-transparent px-2 text-right text-4xl text-white caret-orange-200 focus:outline-none"
        autoFocus
        type="text"
        name="regex"
        value={regex}
        autoComplete="off"
        onChange={handleChange}
        spellCheck="false"
        inputMode="none"
      />

      <div className="flex">
        <button
          className="group flex h-10 w-10 items-center justify-center rounded-full active:bg-gray-400"
          disabled={regex.length === 0}
          onClick={() => setRegex('')}
        >
          <RecycleBin className="h-8 w-8 fill-red-400 group-disabled:fill-red-800" />
        </button>
        <button
          className="group ml-auto flex h-10 w-10 items-center justify-center rounded-full active:bg-gray-400"
          disabled={regex.length === 0}
          onClick={handleBackspace}
        >
          <Backspace className="h-8 w-8 fill-orange-400 group-disabled:fill-orange-800" />
        </button>
      </div>

      <div className="flex justify-center gap-4">
        {alphabet.map((symbol, index) => (
          <button
            key={index}
            className="h-14 w-14 rounded-full bg-gray-700 text-center text-2xl text-white active:bg-gray-400"
            onClick={(e) => handleAddition(e, symbol)}
          >
            {symbol}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        {operators.map((operator, index) => (
          <button
            key={index}
            className="h-14 w-14 rounded-full bg-gray-500 text-center text-2xl text-white active:bg-gray-200"
            onClick={(e) => handleAddition(e, operator)}
          >
            {operator}
          </button>
        ))}
      </div>
    </section>
  );
};
