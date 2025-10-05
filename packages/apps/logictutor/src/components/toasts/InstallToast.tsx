import { FC } from 'react';

interface InstallToastProps {
  onUpdate: () => void; // Function to handle update (install the PWA)
  onClose: () => void; // Function to close the toast
}

export const InstallToast: FC<InstallToastProps> = ({ onUpdate, onClose }) => {
  return (
    <div className="flex">
      <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300">
        {/* Icon */}
        <svg
          className="h-4 w-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97"
          />
        </svg>
        <span className="sr-only">Refresh icon</span>
      </div>
      <div className="ml-3 text-sm font-normal">
        <span className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
          Install App
        </span>
        <div className="mb-2 text-sm font-normal text-gray-500 dark:text-gray-400">
          Please install this application for the best user experience.
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <button
              onClick={onUpdate}
              className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-2 py-1.5 text-center text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
            >
              Install
            </button>
          </div>
          <div>
            <button
              onClick={onClose}
              className="inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-center text-xs font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
