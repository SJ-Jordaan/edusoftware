export const TimelineLoader = ({ animate }: { animate?: boolean }) => (
  <div
    className={`${animate ? 'animate-pulse' : ''} flex flex-col w-full p-4 ml-3 mt-4 border-l border-gray-200 dark:border-gray-700`}
  >
    <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-48 max-w-[360px] mb-2.5"></div>
    <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2.5"></div>
    <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-full max-w-[360px]"></div>
  </div>
);
