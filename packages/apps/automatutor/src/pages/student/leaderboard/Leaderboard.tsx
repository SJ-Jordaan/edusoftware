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
      <h1 className="text-white text-xl text-center mb-12">LeaderBoard</h1>

      <div className="flex *:flex-1 *:flex *:flex-col *:justify-center *:items-center *:text-center mx-4 mb-4">
        <div className="bg-neutral-600 dark:bg-slate-700 p-4 pt-8 rounded-l-xl relative h-36 self-end space-y-2">
          <div className="absolute -top-8 w-16 h-16">
            <Second className="w-full h-full" />
          </div>
          <p className="text-sm text-white max-w-full text-ellipsis line-clamp-2 overflow-hidden">
            {second?.userDetails?.name ?? 'None'}
          </p>
          <p className="text-xl text-blue-400">{second?.totalScore ?? 0}</p>
        </div>
        <div className="bg-neutral-600 dark:bg-slate-600 p-4 pt-6 rounded-t-xl relative h-44 space-y-2">
          <div className="absolute -top-8 w-16 h-16">
            <First className="w-full h-full" />
          </div>
          <p className="text-sm text-white max-w-full text-ellipsis line-clamp-2 overflow-hidden">
            {first?.userDetails?.name ?? 'None'}
          </p>
          <p className="text-xl text-orange-400">{first?.totalScore ?? 0}</p>
        </div>
        <div className="bg-neutral-600 dark:bg-slate-700 p-4 pt-6 rounded-r-xl relative h-36 self-end space-y-2">
          <div className="absolute -top-8 w-16 h-16">
            <Third className="w-full h-full" />
          </div>
          <p className="text-sm text-white max-w-full text-ellipsis line-clamp-2 overflow-hidden">
            {third?.userDetails?.name ?? 'None'}
          </p>
          <p className="text-xl text-green-400">{third?.totalScore ?? 0}</p>
        </div>
      </div>

      <div className="flex flex-col rounded-t-2xl px-4 bg-neutral-600 dark:bg-slate-700 w-full divide-y divide-gray-600">
        {rest.map((position, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-4 bg-neutral-600 dark:bg-slate-700 ${COLOURS[index]}`}
          >
            <div
              className={`rounded-full border-2 w-8 h-8 text-center text-lg ${COLOURS[index]}`}
            >
              {index + 4}
            </div>
            <p>{position.userDetails?.name}</p>
            <p>{position.totalScore}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
