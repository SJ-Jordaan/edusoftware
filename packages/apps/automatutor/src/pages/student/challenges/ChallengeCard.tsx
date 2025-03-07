import { useAuth } from '../../../slices/auth.slice';
import { PopulatedLevel, UserProgress } from '@edusoftware/core/src/types';
import {
  CalendarIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { useCallback, useMemo } from 'react';

interface ChallengeCardProps {
  level: PopulatedLevel;
  progress?: UserProgress;
  onStart: () => void;
  onReset: () => void;
  viewMode: 'grid' | 'list';
}

export const ChallengeCard = ({
  level,
  progress,
  onStart,
  onReset,
  viewMode,
}: ChallengeCardProps) => {
  const { isAdmin } = useAuth();
  const { levelName, description, startDate, endDate, organisation } = level;

  const status = useMemo(() => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (progress?.completedAt) {
      return { type: 'completed', label: 'Completed' };
    }
    if (now < start) {
      return { type: 'upcoming', label: 'Upcoming' };
    }
    if (now > end) {
      return { type: 'ended', label: 'Ended' };
    }
    if (progress) {
      return { type: 'inProgress', label: 'In Progress' };
    }
    return { type: 'active', label: 'Active' };
  }, [startDate, endDate, progress]);

  const timeInfo = useMemo(() => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (status.type === 'completed') {
      return `Completed on ${new Date(progress!.completedAt!).toLocaleDateString()}`;
    }

    if (status.type === 'upcoming') {
      const daysUntil = Math.ceil(
        (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      return daysUntil === 1
        ? 'Starts tomorrow'
        : `Starts in ${daysUntil} days`;
    }

    if (status.type === 'ended') {
      return `Ended on ${end.toLocaleDateString()}`;
    }

    // Active or in progress
    const daysLeft = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysLeft === 1 ? 'Ends tomorrow' : `${daysLeft} days remaining`;
  }, [startDate, endDate, status, progress]);

  const getStatusColor = useCallback(() => {
    switch (status.type) {
      case 'completed':
        return 'bg-green-500';
      case 'upcoming':
        return 'bg-purple-500';
      case 'ended':
        return 'bg-gray-500';
      case 'inProgress':
        return 'bg-blue-500';
      case 'active':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  }, [status.type]);

  const getProgressPercentage = useCallback(() => {
    if (!progress) return 0;
    if (progress.completedAt) return 100;

    const totalQuestions = level.questionIds?.length;
    const answeredQuestions = progress.questionsAttempted.filter(
      (q) => q.correct !== null,
    ).length;

    return Math.round((answeredQuestions / totalQuestions!) * 100);
  }, [progress]);

  if (viewMode === 'list') {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-md transition-all duration-300 hover:border-gray-600 hover:shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Status indicator */}
          <div
            className={`${getStatusColor()} h-2 w-full flex-shrink-0 md:h-auto md:w-2`}
          ></div>

          <div className="flex flex-grow flex-col gap-4 p-4 md:flex-row">
            <div className="flex-grow">
              <div className="mb-2 flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor()} bg-opacity-20 text-white`}
                >
                  {status.label}
                </span>
                <span className="flex items-center text-xs text-gray-400">
                  <ClockIcon className="mr-1 h-3 w-3" />
                  {timeInfo}
                </span>
              </div>

              <h3 className="mb-1 text-xl font-bold text-white">{levelName}</h3>

              <div className="mb-2 flex items-center">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {organisation}
                </span>

                {progress && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    {progress.totalScore} points
                  </span>
                )}
              </div>

              <p className="line-clamp-1 text-sm text-gray-400">
                {description}
              </p>

              {progress && !progress.completedAt && (
                <div className="mt-3 h-1.5 w-full rounded-full bg-gray-700">
                  <div
                    className="h-1.5 rounded-full bg-blue-600"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 md:flex-col">
              {status.type === 'active' || status.type === 'inProgress' ? (
                <button
                  onClick={onStart}
                  className="inline-flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  {progress ? 'Continue' : 'Start'}
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              ) : null}

              {progress && isAdmin && (
                <button
                  onClick={onReset}
                  className="inline-flex items-center justify-center gap-1 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Reset
                  <ArrowPathIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 shadow-md transition-all duration-300 hover:border-gray-600 hover:shadow-xl">
      {/* Status bar */}
      <div
        className={`absolute left-0 right-0 top-0 h-1 ${getStatusColor()}`}
      ></div>

      <div className="flex flex-grow flex-col p-6">
        {/* Header with status and organization */}
        <div className="mb-4 flex items-start justify-between">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor()} bg-opacity-20 text-white`}
          >
            {status.label}
          </span>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {organisation}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-blue-400">
          {levelName}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2 flex-grow text-sm text-gray-400">
          {description}
        </p>

        {/* Progress indicator */}
        {progress && (
          <div className="mb-4">
            {progress.completedAt ? (
              <div className="flex items-center text-sm text-green-400">
                <CheckCircleIcon className="mr-1 h-4 w-4" />
                <span>Completed</span>
              </div>
            ) : (
              <>
                <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                  <span>Progress</span>
                  <span>{getProgressPercentage()}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-700">
                  <div
                    className="h-1.5 rounded-full bg-blue-600"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </>
            )}

            {progress.totalScore > 0 && (
              <div className="mt-2 text-sm font-medium text-yellow-500">
                {progress.totalScore} points earned
              </div>
            )}
          </div>
        )}

        {/* Time info */}
        <div className="mb-4 flex items-center text-xs text-gray-400">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{timeInfo}</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {status.type === 'active' || status.type === 'inProgress' ? (
            <button
              onClick={onStart}
              className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              {progress ? 'Continue' : 'Start'}
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          ) : status.type === 'upcoming' ? (
            <button
              disabled
              className="inline-flex w-full cursor-not-allowed items-center justify-center gap-1 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300"
            >
              Coming Soon
              <ClockIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              disabled
              className="inline-flex w-full cursor-not-allowed items-center justify-center gap-1 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300"
            >
              Challenge Ended
              <ExclamationCircleIcon className="h-4 w-4" />
            </button>
          )}

          {progress && isAdmin && (
            <button
              onClick={onReset}
              className="inline-flex items-center justify-center gap-1 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              title="Reset Challenge"
            >
              <ArrowPathIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
