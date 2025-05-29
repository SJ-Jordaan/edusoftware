interface FilterPillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const FilterPill = ({ label, isActive, onClick }: FilterPillProps) => (
  <button
    onClick={onClick}
    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
    }`}
  >
    {label}
  </button>
);
