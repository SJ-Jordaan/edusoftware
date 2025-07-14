import { UserProgress } from '@edusoftware/core/src/types';
import {
  useDeleteLogictutorLevelMutation,
  useGetAllLevelsQuery,
} from '../../../../slices/testApi.slice';
import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';

interface PracticeCardProps {
  levelName: string;
  levelId: string;
  description: string;
  onClick: () => void;
  onReset: () => void;
  progress: UserProgress | undefined;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

const difficultyConfig = {
  BEGINNER: {
    background: 'bg-emerald-500',
    border: 'border-emerald-500 border',
    label: 'Beginner',
    icon: '🌱',
  },
  INTERMEDIATE: {
    background: 'bg-amber-500',
    border: 'border-amber-500 border',
    label: 'Intermediate',
    icon: '🌿',
  },
  ADVANCED: {
    background: 'bg-red-500',
    border: 'border-red-500 border',
    label: 'Advanced',
    icon: '🌳',
  },
} as const;

export const PracticeCard = ({
  levelName,
  levelId,
  description,
  onClick,
  onReset,
  progress,
  difficulty,
}: PracticeCardProps) => {
  const [deleteLevel, { isLoading: isDeleting, error: deleteError }] =
    useDeleteLogictutorLevelMutation(undefined);

  const { refetch } = useGetAllLevelsQuery(undefined);

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl dark:bg-gray-800">
      <div>{JSON.stringify(deleteError, null, 4)}</div>
      {/* Difficulty indicator stripe */}
      <div
        className={`absolute left-0 top-0 h-full w-2 ${difficultyConfig[difficulty].background}`}
      />

      <div className="flex h-full flex-col">
        {/* Header section */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {levelName}
          </h3>
          <div className="flex gap-4">
            <div
              className={`flex shrink-0 items-center justify-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white ${difficultyConfig[difficulty].border}`}
            >
              <span className="mr-1">{difficultyConfig[difficulty].icon}</span>
              <span className="whitespace-nowrap">
                {difficultyConfig[difficulty].label}
              </span>
            </div>
            <button
              onClick={async () => {
                await deleteLevel(levelId);
                refetch();
              }}
              disabled={isDeleting}
              className={`
                rounded-full
                bg-gray-700
                p-2
                text-gray-300
                shadow-md
                transition
                ${isDeleting ? 'cursor-not-allowed opacity-70' : 'hover:bg-red-600 hover:text-white'}
                focus:outline-none
                focus:ring-2
                focus:ring-red-500
              `}
              aria-label="Delete"
            >
              {isDeleting ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                <TrashIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>

        {/* Progress indicators */}
        {progress && (
          <div className="mt-4 flex items-center gap-3">
            {progress.completedAt && (
              <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Solved</span>
              </div>
            )}
            <div className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{progress.totalScore} points</span>
            </div>
          </div>
        )}

        {/* Action buttons - now using mt-auto to push to bottom */}
        <div className="mt-auto pt-6">
          <div className="flex gap-3">
            {!progress?.completedAt ? (
              <button
                onClick={onClick}
                className="flex-1 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:hover:bg-indigo-400"
              >
                {!progress ? 'Start Practice' : 'Continue Practice'}
              </button>
            ) : (
              <button
                onClick={onReset}
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Reset Progress
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
