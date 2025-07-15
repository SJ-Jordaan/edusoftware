import {
  useDeleteLogictutorLevelMutation,
  useGetAllLevelsQuery,
} from '../../../../slices/testApi.slice';
import {
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface PracticeCardProps {
  levelName: string;
  levelId: string;
  description: string;
  onClick: () => void;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  isAdmin: boolean;
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
  difficulty,
  isAdmin,
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
            {isAdmin ? (
              <>
                <button
                  onClick={async () => {
                    console.warn('TODO');
                    refetch();
                  }}
                  disabled={isDeleting}
                  className={`rounded-full bg-gray-700 p-2 text-gray-300 shadow-md transition ${isDeleting ? 'cursor-not-allowed opacity-70' : 'hover:bg-indigo-500 hover:text-white'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  aria-label="Edit"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={async () => {
                    await deleteLevel(levelId);
                    refetch();
                  }}
                  disabled={isDeleting}
                  className={`rounded-full bg-gray-700 p-2 text-gray-300 shadow-md transition ${isDeleting ? 'cursor-not-allowed opacity-70' : 'hover:bg-red-600 hover:text-white'} focus:outline-none focus:ring-2 focus:ring-red-500`}
                  aria-label="Delete"
                >
                  {isDeleting ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    <TrashIcon className="h-5 w-5" />
                  )}
                </button>
              </>
            ) : (
              <div
                className={`flex shrink-0 items-center justify-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white ${difficultyConfig[difficulty].border}`}
              >
                <span className="mr-1">
                  {difficultyConfig[difficulty].icon}
                </span>
                <span className="whitespace-nowrap">
                  {difficultyConfig[difficulty].label}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>

        {/* Action buttons - now using mt-auto to push to bottom */}
        <div className="mt-auto pt-6">
          <div className="flex gap-3">
            <button
              onClick={onClick}
              className={`flex-1 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-colors ${isDeleting ? 'cursor-not-allowed opacity-70' : 'hover:bg-indigo-600 dark:hover:bg-indigo-400'}  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              disabled={isDeleting}
            >
              {isAdmin ? 'Test Level' : 'Start Practice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
