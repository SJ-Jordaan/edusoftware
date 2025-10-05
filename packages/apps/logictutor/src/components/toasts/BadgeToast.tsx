import { FC } from 'react';
import { Badge } from '@edusoftware/core/src/types';

interface BadgeToastProps {
  badge: Badge;
  onClose: () => void;
}

export const BadgeToast: FC<BadgeToastProps> = ({ badge, onClose }) => {
  return (
    <div className="flex">
      <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-white text-orange-500 dark:text-orange-300">
        {badge.icon ? (
          <img src={badge.icon} alt={badge.name} className="h-8 w-8" />
        ) : (
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        )}
      </div>

      <div className="ml-3 text-sm font-normal">
        <span className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">
          New Badge Earned! 🎉
        </span>
        <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {badge.name}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {badge.description}
        </p>

        <div className="mt-3">
          <button
            onClick={onClose}
            className="inline-flex w-full justify-center rounded-lg bg-orange-600 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:ring-orange-800"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
};
