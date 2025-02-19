import { UserProgress } from '@edusoftware/core/src/types';
import { useAuth } from '../../../../slices/auth.slice';

interface TimelineItemProps {
  levelName: string;
  description: string;
  startDate: string;
  endDate: string;
  onClick: () => void;
  onReset: () => void;
  progress: UserProgress | undefined;
  organisation: string;
}

export const TimeLineItem = ({
  levelName,
  description,
  startDate,
  endDate,
  onClick,
  onReset,
  progress,
  organisation,
}: TimelineItemProps) => {
  const { isAdmin } = useAuth();
  const hasStarted = new Date(startDate) < new Date();
  const hasEnded = new Date(endDate) < new Date();

  return (
    <li className="relative mb-8 ms-6">
      <div
        className={`absolute -start-3 mt-1.5 h-6 w-6 rounded-full border-4 border-white dark:border-gray-900 ${
          progress?.completedAt
            ? 'bg-green-500'
            : progress
              ? 'bg-blue-500'
              : 'bg-gray-200 dark:bg-gray-700'
        }`}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
        <time className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
          {hasStarted
            ? !hasEnded
              ? `Now until ${new Date(endDate).toLocaleDateString()}`
              : `Ended on ${new Date(endDate).toLocaleDateString()}`
            : `Starts on ${new Date(startDate).toLocaleDateString()}`}
        </time>

        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {levelName}
          </h3>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {organisation}
          </span>
        </div>

        <p className="mb-4 text-base text-gray-600 dark:text-gray-400">
          {description}
        </p>

        <div className="mb-4 flex flex-col space-y-2">
          {progress && (
            <div className="flex space-x-2">
              {progress.completedAt && (
                <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:border-green-500/30 dark:bg-green-900/30 dark:text-green-300">
                  <svg
                    className="mr-1 h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Completed
                </span>
              )}
              <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-900/30 dark:text-yellow-300">
                {progress?.totalScore} points
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {hasStarted && !hasEnded && !progress?.completedAt ? (
            <button
              onClick={onClick}
              className="inline-flex w-fit items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              {progress && !progress.completedAt ? 'Continue' : 'Start'}{' '}
              <svg
                className="ms-2 h-3 w-3 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          ) : null}

          {progress && isAdmin && (
            <button
              onClick={onReset}
              className="inline-flex w-fit items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              {'Reset'}{' '}
              <svg
                className="ms-2 h-3 w-3 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </li>
  );
};
