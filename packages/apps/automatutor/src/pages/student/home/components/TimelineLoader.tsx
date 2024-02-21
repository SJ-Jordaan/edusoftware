export const TimelineLoader = ({ animate }: { animate?: boolean }) => (
  <div
    className={`${animate ? 'animate-pulse' : ''} ml-3 mt-4 flex w-full flex-col border-l border-gray-200 p-4 dark:border-gray-700`}
  >
    <div className="mb-2.5 h-4 w-48 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
    <div className="mb-2.5 h-5 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
    <div className="h-3 w-full max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
  </div>
);
