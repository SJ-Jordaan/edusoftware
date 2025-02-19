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
    <li className="mb-10 ms-4">
      <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
      <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
        {hasStarted
          ? !hasEnded
            ? `Now until ${new Date(endDate).toLocaleDateString()}`
            : `Ended on ${new Date(endDate).toLocaleDateString()}`
          : `Starts on ${new Date(startDate).toLocaleDateString()}`}
      </time>
      <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
        {levelName}
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          {organisation}
        </span>
      </h3>
      <p className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
        {description}
      </p>
      <div className="flex flex-col space-y-2">
        {progress && (
          <div className="flex space-x-2">
            {progress.completedAt && (
              <span className="me-2 w-fit rounded border border-green-400 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-gray-700 dark:text-green-400">
                Completed
              </span>
            )}
            <span className="me-2 w-fit rounded border border-yellow-300 bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-gray-700 dark:text-yellow-300">
              {progress?.totalScore} points
            </span>
          </div>
        )}

        <div className="flex gap-4 pt-2">
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
