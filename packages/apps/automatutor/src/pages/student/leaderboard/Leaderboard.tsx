import { extractStudentNumber } from '@edusoftware/core/src/algorithms';
import First from '../../../assets/first-icon.svg?react';
import Second from '../../../assets/second-icon.svg?react';
import Third from '../../../assets/third-icon.svg?react';
import { useFetchLeaderboardQuery } from '../../../slices/scoreApi.slice';
import ErrorPage from '../../ErrorPage';
import { COLOURS } from './common/colours';
import { LeaderboardLoader } from './components/LeaderboardLoader';

export const LeaderBoard = () => {
  const { data: leaderboard, error, isLoading } = useFetchLeaderboardQuery();

  if (isLoading) return <LeaderboardLoader />;
  if (error || !leaderboard) return <ErrorPage />;

  const [first, second, third, ...rest] = leaderboard;

  return (
    <div className="flex flex-col pt-4">
      <h1 className="mb-12 text-center text-xl text-white">LeaderBoard</h1>

      <div className="mx-4 mb-4 flex *:flex *:flex-1 *:flex-col *:items-center *:justify-center *:text-center">
        <div className="relative h-36 space-y-2 self-end rounded-l-xl bg-neutral-600 p-4 pt-8 dark:bg-slate-700">
          <div className="absolute -top-8 h-16 w-16">
            <Second className="h-full w-full" />
          </div>
          <div>
            <p className="line-clamp-2 max-w-full overflow-hidden text-ellipsis text-sm text-white">
              {second?.userDetails?.name ?? 'None'}
            </p>
            <p className="line-clamp-1 max-w-full overflow-hidden text-ellipsis text-xs text-gray-400">
              {extractStudentNumber(second?.userDetails?.email) ?? 'None'}
            </p>
          </div>
          <p className="text-xl text-blue-400">{second?.totalScore ?? 0}</p>
        </div>
        <div className="relative h-44 space-y-2 rounded-t-xl bg-neutral-600 p-4 pt-6 dark:bg-slate-600">
          <div className="absolute -top-8 h-16 w-16">
            <First className="h-full w-full" />
          </div>
          <div>
            <p className="line-clamp-2 max-w-full overflow-hidden text-ellipsis text-sm text-white">
              {first?.userDetails?.name ?? 'None'}
            </p>
            <p className="line-clamp-1 max-w-full overflow-hidden text-ellipsis text-xs text-gray-400">
              {extractStudentNumber(first?.userDetails?.email) ?? 'None'}
            </p>
          </div>
          <p className="text-xl text-orange-400">{first?.totalScore ?? 0}</p>
        </div>
        <div className="relative h-36 space-y-2 self-end rounded-r-xl bg-neutral-600 p-4 pt-6 dark:bg-slate-700">
          <div className="absolute -top-8 h-16 w-16">
            <Third className="h-full w-full" />
          </div>
          <div>
            <p className="line-clamp-2 max-w-full overflow-hidden text-ellipsis text-sm text-white">
              {third?.userDetails?.name ?? 'None'}
            </p>
            <p className="line-clamp-1 max-w-full overflow-hidden text-ellipsis text-xs text-gray-400">
              {extractStudentNumber(third?.userDetails?.email) ?? 'None'}
            </p>
          </div>
          <p className="text-xl text-green-400">{third?.totalScore ?? 0}</p>
        </div>
      </div>

      <div className="flex w-full flex-col divide-y divide-gray-600 rounded-t-2xl bg-neutral-600 px-4 dark:bg-slate-700">
        {rest.map((position, index) => (
          <div
            key={index}
            className={`flex items-center justify-between bg-neutral-600 p-4 dark:bg-slate-700 ${COLOURS[index]}`}
          >
            <div
              className={`h-8 w-8 rounded-full border-2 text-center text-lg ${COLOURS[index]}`}
            >
              {index + 4}
            </div>
            <div className="flex flex-col items-center">
              <p>{position.userDetails?.name}</p>
              <p className="line-clamp-1 max-w-full overflow-hidden text-ellipsis text-xs text-gray-400">
                {extractStudentNumber(position?.userDetails?.email) ?? 'None'}
              </p>
            </div>
            <p>{position.totalScore}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
