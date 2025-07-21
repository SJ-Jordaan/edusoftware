interface HintInputProps {
  hint: string;
  index: number;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

export const HintInput = ({
  hint,
  index,
  onUpdate,
  onRemove,
}: HintInputProps) => (
  <div className="flex items-center space-x-2">
    <input
      type="text"
      value={hint}
      onChange={(e) => onUpdate(index, e.target.value)}
      className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
      placeholder={`Hint ${index + 1}`}
    />
    <button
      type="button"
      onClick={() => onRemove(index)}
      className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
    >
      Remove
    </button>
  </div>
);
