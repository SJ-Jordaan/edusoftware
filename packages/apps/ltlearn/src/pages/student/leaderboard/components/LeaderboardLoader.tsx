export const LeaderboardLoader = () => (
  <div className="flex animate-pulse flex-col pt-4">
    <div className="mx-auto mb-12 h-4 w-[300px] rounded-full bg-gray-300 dark:bg-gray-700"></div>
    <div className="mx-4 mb-4 flex *:flex *:flex-1 *:flex-col *:items-center *:justify-center *:text-center">
      <div className="relative h-36 space-y-2 self-end rounded-l-xl bg-neutral-600 p-4 pt-8 dark:bg-slate-700">
        <div className="absolute -top-8 h-16 w-16">
          <svg
            className="me-4 h-full w-full text-gray-200 dark:text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
        </div>
        <p className="line-clamp-2 max-w-full overflow-hidden text-ellipsis text-sm text-white"></p>
        <p className="text-xl text-blue-400"></p>
      </div>
      <div className="relative h-44 space-y-2 rounded-t-xl bg-neutral-600 p-4 pt-6 dark:bg-slate-600">
        <div className="absolute -top-8 h-16 w-16">
          <svg
            className="me-4 h-full w-full text-gray-200 dark:text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
        </div>
        <p className="line-clamp-2 max-w-full overflow-hidden text-ellipsis text-sm text-white"></p>
        <p className="text-xl text-orange-400"></p>
      </div>
      <div className="relative h-36 space-y-2 self-end rounded-r-xl bg-neutral-600 p-4 pt-6 dark:bg-slate-700">
        <div className="absolute -top-8 h-16 w-16">
          <svg
            className="me-4 h-full w-full text-gray-200 dark:text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
        </div>
        <p className="line-clamp-2 max-w-full overflow-hidden text-ellipsis text-sm text-white"></p>
        <p className="text-xl text-green-400"></p>
      </div>
    </div>
    <div className="flex w-full flex-col divide-y divide-gray-600 rounded-t-2xl bg-neutral-600 px-4 dark:bg-slate-700">
      {Array.from({ length: 7 }).map((_item, index) => (
        <div
          key={`loader-rest-${index}`}
          className="flex items-center justify-between pt-4"
        >
          <div>
            <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
      ))}
    </div>
  </div>
);
