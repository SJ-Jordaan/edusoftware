import { FC } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

interface FeedbackToastProps {
  isCorrect: boolean;
  message: string;
  hint?: string;
  onClose: () => void;
}

export const FeedbackToast: FC<FeedbackToastProps> = ({
  isCorrect,
  message,
  hint,
  onClose,
}) => {
  return (
    <div className="animate-fade-in overflow-hidden rounded-lg shadow-lg">
      {/* Status Bar on top */}
      <div
        className={`h-1 ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}
      ></div>

      <div className="flex bg-gray-800 p-4">
        {/* Icon */}
        <div
          className={`inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg 
          ${
            isCorrect
              ? 'bg-emerald-500/20 text-emerald-500'
              : 'bg-red-500/20 text-red-500'
          }`}
        >
          {isCorrect ? (
            <CheckCircleIcon className="h-8 w-8 stroke-2" />
          ) : (
            <XCircleIcon className="h-8 w-8 stroke-2" />
          )}
        </div>

        {/* Content */}
        <div className="ml-3 flex-1 text-sm">
          <div className="mb-1 text-base font-semibold text-white">
            {isCorrect ? 'Correct!' : 'Not quite right'}
          </div>

          <p className="mb-2 text-gray-300">{message}</p>

          {!isCorrect && hint && (
            <div className="mt-2 flex items-center rounded-md bg-amber-900/30 p-2 text-xs text-amber-300">
              <LightBulbIcon className="mr-2 h-4 w-4 flex-shrink-0" />
              <p>{hint}</p>
            </div>
          )}

          {/* Action button */}
          <div className="mt-3 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors
                ${
                  isCorrect
                    ? 'bg-emerald-700 text-white hover:bg-emerald-600 focus:ring-emerald-500'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-400'
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
              `}
            >
              {isCorrect && <CheckIcon className="mr-1 h-3 w-3" />}
              {isCorrect ? 'Awesome!' : 'Try again'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
