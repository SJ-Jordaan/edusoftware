import { extractStudentNumber } from '@edusoftware/core/src/algorithms';
import { useState, useMemo } from 'react';
import First from '../../../assets/first-icon.svg?react';
import Second from '../../../assets/second-icon.svg?react';
import Third from '../../../assets/third-icon.svg?react';
import { useFetchLeaderboardQuery } from '../../../slices/scoreApi.slice';
import { useFetchLevelsQuery } from '../../../slices/levelApi.slice';
import ErrorPage from '../../ErrorPage';
import { LeaderboardLoader } from './components/LeaderboardLoader';

// Add these helper functions at the top of the file
const getInitials = (name: string | undefined | null): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 40%)`;
};

const AvatarFallback = ({
  name,
  size = 'h-10 w-10',
}: {
  name: string | undefined | null;
  size?: string;
}) => {
  const initials = getInitials(name);
  const backgroundColor = stringToColor(name || '?');

  return (
    <div
      className={`${size} flex items-center justify-center rounded-full text-sm font-medium text-white`}
      style={{ backgroundColor }}
    >
      {initials}
    </div>
  );
};

export const LeaderBoard = () => {
  const [selectedLevelId, setSelectedLevelId] = useState('');
  const { data: leaderboard, error, isLoading } = useFetchLeaderboardQuery({});
  const { data: levels } = useFetchLevelsQuery({ isPractice: false });

  const currentLeaderboard = useMemo(() => {
    if (!leaderboard) return [];
    return selectedLevelId
      ? leaderboard.perLevel.find((level) => level.levelId === selectedLevelId)
          ?.scores || []
      : leaderboard.overall;
  }, [leaderboard, selectedLevelId]);

  if (isLoading) return <LeaderboardLoader />;
  if (error || !leaderboard) return <ErrorPage />;

  const [first, second, third, ...rest] = currentLeaderboard;

  const renderScores = (entry: any) => {
    if (!entry) return null;

    return (
      <div className="flex flex-col items-center">
        <p className="text-lg font-semibold text-orange-400">
          {entry.totalScore.toLocaleString()} pts
        </p>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header with improved filter UI */}
        <div className="mb-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
            <p className="mt-2 text-gray-400">
              See who's leading the pack in learning achievements
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setSelectedLevelId('')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !selectedLevelId
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Overall Rankings
            </button>
            <div className="h-4 w-px bg-gray-700" />
            <div className="flex flex-wrap items-center gap-2">
              {levels?.map((level) => (
                <button
                  key={level._id}
                  onClick={() => setSelectedLevelId(level._id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedLevelId === level._id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {level.levelName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {currentLeaderboard.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-lg text-gray-400">
              {selectedLevelId
                ? 'No scores recorded for this level yet'
                : 'No scores recorded yet'}
            </p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium - Existing code remains the same */}
            <div className="mb-12 flex *:flex *:flex-1 *:flex-col *:items-center *:justify-start *:text-center">
              {/* Second Place */}
              <div className="relative h-48 space-y-2 self-end rounded-l-xl bg-gray-800 p-2 pt-8 sm:p-4">
                <div className="absolute -top-8 h-16 w-16">
                  <Second className="h-full w-full" />
                </div>
                <div className="flex h-full flex-col items-center justify-between">
                  <div className="flex flex-col items-center">
                    {second?.userDetails?.picture ? (
                      <img
                        src={second.userDetails.picture}
                        alt={second.userDetails.name}
                        className="border-silver h-10 w-10 rounded-full border-2 sm:h-12 sm:w-12"
                      />
                    ) : (
                      <AvatarFallback name={second?.userDetails?.name} />
                    )}
                    <p className="mt-1 line-clamp-1 text-sm font-medium text-white sm:mt-2 sm:text-base">
                      {second?.userDetails?.name ?? 'None'}
                    </p>
                    <p className="text-xs text-gray-400 sm:text-sm">
                      {extractStudentNumber(second?.userDetails?.email) ??
                        'None'}
                    </p>
                  </div>
                  <div className="mb-2 mt-auto">{renderScores(second)}</div>
                </div>
              </div>

              {/* First Place */}
              <div className="relative h-56 space-y-2 rounded-t-xl bg-gray-800 p-2 pt-6 sm:p-4">
                <div className="absolute -top-8 h-16 w-16">
                  <First className="h-full w-full" />
                </div>
                <div className="flex h-full flex-col items-center justify-between">
                  <div className="flex flex-col items-center">
                    {first?.userDetails?.picture ? (
                      <img
                        src={first.userDetails.picture}
                        alt={first.userDetails.name}
                        className="border-gold h-10 w-10 rounded-full border-2 sm:h-12 sm:w-12"
                      />
                    ) : (
                      <AvatarFallback name={first?.userDetails?.name} />
                    )}
                    <p className="mt-1 line-clamp-1 text-sm font-medium text-white sm:mt-2 sm:text-base">
                      {first?.userDetails?.name ?? 'None'}
                    </p>
                    <p className="text-xs text-gray-400 sm:text-sm">
                      {extractStudentNumber(first?.userDetails?.email) ??
                        'None'}
                    </p>
                  </div>
                  <div className="mb-2 mt-auto">{renderScores(first)}</div>
                </div>
              </div>

              {/* Third Place */}
              <div className="relative h-48 space-y-2 self-end rounded-r-xl bg-gray-800 p-2 pt-6 sm:p-4">
                <div className="absolute -top-8 h-16 w-16">
                  <Third className="h-full w-full" />
                </div>
                <div className="flex h-full flex-col items-center justify-between">
                  <div className="flex flex-col items-center">
                    {third?.userDetails?.picture ? (
                      <img
                        src={third.userDetails.picture}
                        alt={third.userDetails.name}
                        className="border-bronze h-10 w-10 rounded-full border-2 sm:h-12 sm:w-12"
                      />
                    ) : (
                      <AvatarFallback name={third?.userDetails?.name} />
                    )}
                    <p className="mt-1 line-clamp-1 text-sm font-medium text-white sm:mt-2 sm:text-base">
                      {third?.userDetails?.name ?? 'None'}
                    </p>
                    <p className="text-xs text-gray-400 sm:text-sm">
                      {extractStudentNumber(third?.userDetails?.email) ??
                        'None'}
                    </p>
                  </div>
                  <div className="mb-2 mt-auto">{renderScores(third)}</div>
                </div>
              </div>
            </div>

            {/* Rest of Leaderboard with improved styling */}
            <div className="overflow-hidden rounded-xl bg-gray-800 shadow-xl">
              {rest.map((entry, index) => (
                <div
                  key={entry.userId}
                  className="flex items-center gap-4 border-b border-gray-700/50 p-4 transition-colors last:border-0 hover:bg-gray-700/30"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-sm font-medium text-white">
                    {index + 4}
                  </div>

                  <div className="flex flex-1 items-center gap-4">
                    {entry.userDetails?.picture ? (
                      <img
                        src={entry.userDetails.picture}
                        alt={entry.userDetails.name}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <AvatarFallback name={entry.userDetails?.name} />
                    )}

                    <div>
                      <p className="font-medium text-white">
                        {entry.userDetails?.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {extractStudentNumber(entry.userDetails?.email)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-orange-300">
                      {entry.totalScore.toLocaleString()} pts
                    </p>
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
