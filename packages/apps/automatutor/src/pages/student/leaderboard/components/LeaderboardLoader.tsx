export const LeaderboardLoader = () => (
  <div className="animate-pulse flex flex-col pt-4">
    <div className="h-4 bg-gray-300 rounded-full dark:bg-gray-700 w-[300px] mb-12 mx-auto"></div>
    <div className="flex *:flex-1 *:flex *:flex-col *:justify-center *:items-center *:text-center mx-4 mb-4">
      <div className="bg-neutral-600 dark:bg-slate-700 p-4 pt-8 rounded-l-xl relative h-36 self-end space-y-2">
        <div className="absolute -top-8 w-16 h-16">
          <svg
            className="w-full h-full text-gray-200 dark:text-gray-500 me-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
        </div>
        <p className="text-sm text-white max-w-full text-ellipsis line-clamp-2 overflow-hidden"></p>
        <p className="text-xl text-blue-400"></p>
      </div>
      <div className="bg-neutral-600 dark:bg-slate-600 p-4 pt-6 rounded-t-xl relative h-44 space-y-2">
        <div className="absolute -top-8 w-16 h-16">
          <svg
            className="w-full h-full text-gray-200 dark:text-gray-500 me-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
        </div>
        <p className="text-sm text-white max-w-full text-ellipsis line-clamp-2 overflow-hidden"></p>
        <p className="text-xl text-orange-400"></p>
      </div>
      <div className="bg-neutral-600 dark:bg-slate-700 p-4 pt-6 rounded-r-xl relative h-36 self-end space-y-2">
        <div className="absolute -top-8 w-16 h-16">
          <svg
            className="w-full h-full text-gray-200 dark:text-gray-500 me-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
        </div>
        <p className="text-sm text-white max-w-full text-ellipsis line-clamp-2 overflow-hidden"></p>
        <p className="text-xl text-green-400"></p>
      </div>
    </div>
    <div className="flex flex-col rounded-t-2xl px-4 bg-neutral-600 dark:bg-slate-700 w-full divide-y divide-gray-600">
      {Array.from({ length: 7 }).map((_item, index) => (
        <div
          key={`loader-rest-${index}`}
          className="flex justify-between items-center pt-4"
        >
          <div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
      ))}
    </div>
  </div>
);
