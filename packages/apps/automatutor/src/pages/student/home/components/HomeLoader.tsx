import { TimelineLoader } from './TimelineLoader';

export const HomeLoader = () => (
  <div className=" h-full w-full animate-pulse p-4">
    <div className="flex w-full items-center space-x-4">
      <svg
        className="h-20 w-20 text-gray-200 dark:text-gray-500"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
      </svg>
      <div role="status" className="max-w-sm">
        <div className="mb-2.5 h-4 w-48 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-2.5 h-5 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-3 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
    <div className="mb-4 flex w-full space-x-4 border-b border-gray-200 py-4 dark:border-gray-700">
      <div className="h-4 w-1/3 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-4 w-1/3 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
    </div>
    <TimelineLoader />
    <TimelineLoader />
    <TimelineLoader />
  </div>
);
