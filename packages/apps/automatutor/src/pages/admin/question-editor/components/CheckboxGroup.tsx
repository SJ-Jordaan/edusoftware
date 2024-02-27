interface CheckboxOptions {
  [key: string]: boolean;
}

interface CheckboxGroupProps {
  options: string[];
  state: CheckboxOptions;
  onChange: (groupName: 'alphabet' | 'operators', option: string) => void;
  groupName: 'alphabet' | 'operators';
}

export const CheckboxGroup = ({
  options,
  state,
  onChange,
  groupName,
}: CheckboxGroupProps) => (
  <div className="grid grid-cols-4 gap-4">
    {options.map((option) => (
      <label
        key={option}
        className="flex items-center space-x-2 dark:text-gray-50"
      >
        <input
          type="checkbox"
          checked={state[option] || false}
          onChange={() => onChange(groupName, option)}
        />
        <span>{option}</span>
      </label>
    ))}
  </div>
);
