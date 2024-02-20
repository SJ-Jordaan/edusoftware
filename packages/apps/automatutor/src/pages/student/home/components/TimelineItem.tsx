import { UserProgress } from '@edusoftware/core/src/types';

interface TimelineItemProps {
  levelName: string;
  description: string;
  startDate: string;
  endDate: string;
  onClick: () => void;
  progress: UserProgress | undefined;
}

export const TimeLineItem = ({
  levelName,
  description,
  startDate,
  endDate,
  onClick,
  progress,
}: TimelineItemProps) => {
  const hasStarted = new Date(startDate) < new Date();
  const hasEnded = new Date(endDate) < new Date();

  return (
    <li className="mb-10 ms-4">
      <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
      <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
        {hasStarted
          ? !hasEnded
            ? `Now until ${new Date(endDate).toLocaleDateString()}`
            : `Ended on ${new Date(endDate).toLocaleDateString()}`
          : `Starts on ${new Date(startDate).toLocaleDateString()}`}
      </time>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {levelName}
      </h3>
      <p className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
        {description}
      </p>
      <div className="flex flex-col space-y-2">
        {progress && (
          <div className="flex space-x-2">
            {progress.completedAt && (
              <span className="w-fit bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
                Completed
              </span>
            )}
            <span className="w-fit bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">
              {progress?.totalScore} points
            </span>
          </div>
        )}

        {hasStarted && !hasEnded && !progress?.completedAt ? (
          <button
            onClick={onClick}
            className="inline-flex w-fit items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >
            {progress && !progress.completedAt ? 'Continue' : 'Start'}{' '}
            <svg
              className="w-3 h-3 ms-2 rtl:rotate-180"
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
      </div>
    </li>
  );
};
