import { extractStudentNumber } from '@edusoftware/core/src/algorithms';
import { useState, useMemo } from 'react';
import First from '../../../assets/first-icon.svg?react';
import Second from '../../../assets/second-icon.svg?react';
import Third from '../../../assets/third-icon.svg?react';
import { useFetchLeaderboardQuery } from '../../../slices/scoreApi.slice';
import { useFetchLevelsQuery } from '../../../slices/levelApi.slice';
import ErrorPage from '../../ErrorPage';
import { LeaderboardLoader } from './components/LeaderboardLoader';

export const LeaderBoard = () => {
  const [selectedLevelId, setSelectedLevelId] = useState('');
  const { data: leaderboard, error, isLoading } = useFetchLeaderboardQuery();
  const { data: levels } = useFetchLevelsQuery();

  // Filter leaderboard data based on selected level
  const filteredLeaderboard = useMemo(() => {
    if (!leaderboard) return [];
    if (!selectedLevelId) return leaderboard;

    return leaderboard.filter((entry) =>
      entry.scores.some((score) => score.levelId === selectedLevelId),
    );
  }, [leaderboard, selectedLevelId]);

  if (isLoading) return <LeaderboardLoader />;
  if (error || !leaderboard) return <ErrorPage />;

  const [first, second, third, ...rest] = filteredLeaderboard;

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-center text-3xl font-bold text-white">
            Leaderboard
          </h1>
          <p className="mt-2 text-center text-gray-400">
            See who's leading the pack in learning achievements
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <select
            value={selectedLevelId}
            onChange={(e) => setSelectedLevelId(e.target.value)}
            className="rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Levels</option>
            {levels?.map((level) => (
              <option key={level._id} value={level._id}>
                {level.levelName} - {level.organisation}
              </option>
            ))}
          </select>
        </div>

        {/* Show message when filtered results are empty */}
        {filteredLeaderboard.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              {selectedLevelId
                ? 'No scores recorded for this level yet'
                : 'No scores recorded yet'}
            </p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <div className="mb-12 flex *:flex *:flex-1 *:flex-col *:items-center *:justify-start *:text-center">
              {/* Second Place */}
              <div className="relative h-48 space-y-2 self-end rounded-l-xl bg-gray-800 p-4 pt-8">
                <div className="absolute -top-8 h-16 w-16">
                  <Second className="h-full w-full" />
                </div>
                <div className="flex h-full flex-col items-center justify-between">
                  <div className="flex flex-col items-center">
                    <img
                      src={
                        second?.userDetails?.picture || '/default-avatar.png'
                      }
                      alt={second?.userDetails?.name}
                      className="border-silver h-12 w-12 rounded-full border-2"
                    />
                    <p className="mt-2 line-clamp-1 font-medium text-white">
                      {second?.userDetails?.name ?? 'None'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {extractStudentNumber(second?.userDetails?.email) ??
                        'None'}
                    </p>
                  </div>
                  <p className="mb-2 text-xl font-bold text-blue-400">
                    {second?.totalScore?.toLocaleString() ?? 0}
                  </p>
                </div>
              </div>

              {/* First Place */}
              <div className="relative h-56 space-y-2 rounded-t-xl bg-gray-800 p-4 pt-6">
                <div className="absolute -top-8 h-16 w-16">
                  <First className="h-full w-full" />
                </div>
                <div className="flex h-full flex-col items-center justify-between">
                  <div className="flex flex-col items-center">
                    <img
                      src={first?.userDetails?.picture || '/default-avatar.png'}
                      alt={first?.userDetails?.name}
                      className="border-gold h-14 w-14 rounded-full border-2"
                    />
                    <p className="mt-2 line-clamp-1 font-medium text-white">
                      {first?.userDetails?.name ?? 'None'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {extractStudentNumber(first?.userDetails?.email) ??
                        'None'}
                    </p>
                  </div>
                  <p className="mb-2 text-2xl font-bold text-orange-400">
                    {first?.totalScore?.toLocaleString() ?? 0}
                  </p>
                </div>
              </div>

              {/* Third Place */}
              <div className="relative h-48 space-y-2 self-end rounded-r-xl bg-gray-800 p-4 pt-6">
                <div className="absolute -top-8 h-16 w-16">
                  <Third className="h-full w-full" />
                </div>
                <div className="flex h-full flex-col items-center justify-between">
                  <div className="flex flex-col items-center">
                    <img
                      src={third?.userDetails?.picture || '/default-avatar.png'}
                      alt={third?.userDetails?.name}
                      className="border-bronze h-12 w-12 rounded-full border-2"
                    />
                    <p className="mt-2 line-clamp-1 font-medium text-white">
                      {third?.userDetails?.name ?? 'None'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {extractStudentNumber(third?.userDetails?.email) ??
                        'None'}
                    </p>
                  </div>
                  <p className="mb-2 text-xl font-bold text-green-400">
                    {third?.totalScore ?? 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Rest of Leaderboard */}
            <div className="rounded-lg bg-gray-800">
              {rest.map((position, index) => (
                <div
                  key={position.userId}
                  className="flex items-center gap-4 border-b border-gray-700 p-4 last:border-0"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-sm font-medium text-white">
                    {index + 4}
                  </span>
                  <img
                    src={position.userDetails?.picture || '/default-avatar.png'}
                    alt={position.userDetails?.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-white">
                      {position.userDetails?.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {extractStudentNumber(position.userDetails?.email)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-white">
                      {position.totalScore}
                    </p>
                    {position.scores?.[0] && (
                      <p className="text-sm text-gray-400">
                        Latest: {position.scores[0].score} pts
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
