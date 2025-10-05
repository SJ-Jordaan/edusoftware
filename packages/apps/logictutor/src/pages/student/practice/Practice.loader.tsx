export const PracticeLoader = () => (
  <div className="container mx-auto animate-pulse">
    <div className="space-y-12">
      {['BEGINNER'].map((difficulty) => (
        <div key={difficulty} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 rounded-lg bg-gray-200 dark:bg-gray-700" />
            <div className="flex gap-2 md:hidden">
              <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <div className="scrollbar-hide -mx-6 flex snap-x snap-mandatory space-x-6 overflow-x-auto px-6 pb-6 md:mx-0 md:snap-none md:px-0">
            {[1].map((i) => (
              <div
                key={i}
                className="w-[calc(100vw-3rem)] flex-none snap-center md:w-[350px]"
              >
                <div className="h-[200px] rounded-xl bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
