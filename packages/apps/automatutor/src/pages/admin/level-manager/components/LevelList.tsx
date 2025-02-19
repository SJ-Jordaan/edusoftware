import { PopulatedLevelObject } from '@edusoftware/core/src/types';
import { formatDate } from '../../common/time';

interface LevelListProps {
  levels: PopulatedLevelObject[];
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
}

export const LevelList = ({ levels, onClick, onDelete }: LevelListProps) => {
  if (levels.length === 0) {
    return (
      <tr>
        <td colSpan={5} className="px-6 py-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-2">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              No levels found
            </p>
          </div>
        </td>
      </tr>
    );
  }

  return levels.map((level) => (
    <tr
      key={level._id}
      className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
    >
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-white">
            {level.levelName}
          </span>
          <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {level.organisation}
          </span>
        </div>
      </td>
      <td className="max-w-xs px-6 py-4">
        <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
          {level.description}
        </p>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-900 dark:text-white">
            Starts {formatDate(level.startDate)}
          </span>
          <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Ends {formatDate(level.endDate)}
          </span>
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-right">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onClick(`/admin/levels/${level._id}`)}
            className="rounded-md p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/50 dark:hover:text-blue-200"
            title="Edit Level"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(level._id)}
            className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-200"
            title="Delete Level"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  ));
};
