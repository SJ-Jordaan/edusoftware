import { FC } from 'react';

interface ErrorToastProps {
  message: string;
  errorTitle: string;
  onClose: () => void;
}

export const ErrorToast: FC<ErrorToastProps> = ({
  message,
  errorTitle,
  onClose,
}) => {
  return (
    <div className="flex rounded-lg  bg-gray-700 p-4 shadow-md">
      <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-red-500">
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
            d="M12 9v2m0 4h.01M5.07 5.07l13.86 13.86M18.93 5.07L5.07 18.93"
          />
        </svg>
      </div>

      <div className="ml-3 text-sm font-normal">
        <span className="mb-1 block text-sm font-semibold text-white">
          {errorTitle}
        </span>
        <div className="mb-2 text-sm font-medium text-gray-400">{message}</div>

        <div className="mt-3">
          <button
            onClick={onClose}
            className="inline-flex w-full justify-center rounded-lg bg-red-500 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-red-600  focus:outline-none focus:ring-4 focus:ring-red-800"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
