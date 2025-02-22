import { extractStudentNumber } from '@edusoftware/core/src/algorithms';
import { useState, useMemo } from 'react';
import First from '../../../assets/first-icon.svg?react';
import Second from '../../../assets/second-icon.svg?react';
import Third from '../../../assets/third-icon.svg?react';
import { useFetchLeaderboardQuery } from '../../../slices/scoreApi.slice';
import { useFetchLevelsQuery } from '../../../slices/levelApi.slice';
import ErrorPage from '../../ErrorPage';
import { LeaderboardLoader } from './components/LeaderboardLoader';
import { LeaderboardEntry } from '@edusoftware/core/src/types';

// Add this helper function at the top of the file, outside the component
const getLevelScore = (entry: LeaderboardEntry, levelId: string) => {
  const levelScore = entry.scores.find((score) => score.levelId === levelId);
  return levelScore?.score ?? 0;
};

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
  const { data: leaderboard, error, isLoading } = useFetchLeaderboardQuery();
  const { data: levels } = useFetchLevelsQuery({
    isPractice: false,
  });

  // Update the filtering logic to include level scores
  const filteredLeaderboard = useMemo(() => {
    if (!leaderboard) return [];
    if (!selectedLevelId) return leaderboard;

    return leaderboard
      .filter((entry) =>
        entry.scores.some((score) => score.levelId === selectedLevelId),
      )
      .sort((a, b) => {
        // Sort by level score first, then by total score
        const aScore = getLevelScore(a, selectedLevelId);
        const bScore = getLevelScore(b, selectedLevelId);
        return bScore - aScore || b.totalScore - a.totalScore;
      });
  }, [leaderboard, selectedLevelId]);

  if (isLoading) return <LeaderboardLoader />;
  if (error || !leaderboard) return <ErrorPage />;

  const [first, second, third, ...rest] = filteredLeaderboard;

  const renderScores = (entry: LeaderboardEntry | undefined) => {
    if (!entry) return null;

    return (
      <div className="space-y-1 text-center">
        <p className="text-base font-bold text-orange-400 sm:text-2xl">
          {selectedLevelId ? (
            <>
              <span>
                {getLevelScore(entry, selectedLevelId).toLocaleString()}
              </span>
              <span className="ml-1 text-xs text-gray-400 sm:text-sm">pts</span>
            </>
          ) : (
            <>
              <span>{entry.totalScore.toLocaleString()}</span>
            </>
          )}
        </p>
        {selectedLevelId && (
          <p className="text-xs text-gray-400 sm:text-sm">
            Total: {entry.totalScore.toLocaleString()}
          </p>
        )}
      </div>
    );
  };

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
                  {position.userDetails?.picture ? (
                    <img
                      src={position.userDetails.picture}
                      alt={position.userDetails.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <AvatarFallback name={position.userDetails?.name} />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-white">
                      {position.userDetails?.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {extractStudentNumber(position.userDetails?.email)}
                    </p>
                  </div>
                  <div className="text-right">
                    {selectedLevelId ? (
                      <>
                        <p className="text-lg font-semibold text-white">
                          {getLevelScore(
                            position,
                            selectedLevelId,
                          ).toLocaleString()}{' '}
                          pts
                        </p>
                        <p className="text-sm text-gray-400">
                          Total: {position.totalScore.toLocaleString()}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-semibold text-white">
                        {position.totalScore.toLocaleString()} total
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
