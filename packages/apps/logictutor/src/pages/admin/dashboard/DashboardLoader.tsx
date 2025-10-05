export const DashboardLoader = () => {
  return (
    <div className="container space-y-8 p-4 md:p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Admin Dashboard
        </h2>
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              Total User Accounts
            </p>
            <div className="mt-2 h-8 w-1/2 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
            <div className="mt-4 h-2 w-full animate-pulse rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="h-350 animate-pulse space-y-4 rounded bg-gray-300 dark:bg-gray-700">
            <div className="h-8 w-1/2 rounded bg-gray-400 dark:bg-gray-600"></div>
            <div className="h-6 w-1/3 rounded bg-gray-400 dark:bg-gray-600"></div>
            <div className="h-4 w-full rounded bg-gray-400 dark:bg-gray-600"></div>
            <div className="h-4 w-full rounded bg-gray-400 dark:bg-gray-600"></div>
            <div className="h-4 w-4/5 rounded bg-gray-400 dark:bg-gray-600"></div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="h-350 animate-pulse space-y-4 rounded bg-gray-300 dark:bg-gray-700">
            <div className="h-8 w-1/2 rounded bg-gray-400 dark:bg-gray-600"></div>
            <div className="h-6 w-1/3 rounded bg-gray-400 dark:bg-gray-600"></div>
            <div className="h-4 w-full rounded bg-gray-400 dark:bg-gray-600"></div>
            <div className="h-4 w-full rounded bg-gray-400 dark:bg-gray-600"></div>
            <div className="h-4 w-4/5 rounded bg-gray-400 dark:bg-gray-600"></div>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="h-350 animate-pulse rounded-full bg-gray-300 dark:bg-gray-700"></div>
      </div>
    </div>
  );
};
