import { useNavigate } from 'react-router-dom';
import { useFetchLevelsQuery } from '../../../slices/levelApi.slice';
import {
  useGetProgressQuery,
  useStartLevelMutation,
} from '../../../slices/progressApi.slice';
import { UserProgress } from '@edusoftware/core/src/types';
import { PageLoader } from '../../../components/loaders/PageLoader';
import { useState, useMemo } from 'react';
import { FilterPill } from '../../../components';
import { ChallengeCard } from './ChallengeCard';
import {
  CalendarIcon,
  ClockIcon,
  TrophyIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const ChallengesPage = () => {
  const navigate = useNavigate();
  const [showEnded, setShowEnded] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: levels,
    error: levelsError,
    isLoading: levelsLoading,
    isFetching: levelsFetching,
  } = useFetchLevelsQuery({
    isPractice: false,
  });

  const [startLevel, { isLoading: startLevelLoading, error: startLevelError }] =
    useStartLevelMutation();

  const {
    data: userProgress,
    isLoading: userProgressLoading,
    error: userProgressError,
    isFetching: userProgressFetching,
  } = useGetProgressQuery();

  const progress = userProgress as UserProgress[] | undefined;

  const handleStartChallenge = async (levelId: string): Promise<void> => {
    try {
      if (startLevelLoading) return;

      if (progress?.find((p) => p.levelId === levelId)) {
        navigate(`/level/${levelId}`);
        return;
      }

      await startLevel(levelId).unwrap();
      navigate(`/level/${levelId}`);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const resetChallenge = async (levelId: string) => {
    try {
      if (startLevelLoading) return;

      await startLevel(levelId).unwrap();
      navigate(`/level/${levelId}`);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const organisations = useMemo(() => {
    if (!levels) return [];
    return Array.from(
      new Set(levels.map((level) => level.organisation)),
    ).sort();
  }, [levels]);

  // Filter levels based on selected filters and search
  const filteredLevels = useMemo(() => {
    if (!levels) return [];

    return levels
      .filter((level) => {
        const hasEndedFilter =
          showEnded || new Date(level.endDate) > new Date();
        const hasOrgFilter = !selectedOrg || level.organisation === selectedOrg;
        const matchesSearch = searchTerm
          ? level.levelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            level.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            level.organisation.toLowerCase().includes(searchTerm.toLowerCase())
          : true;

        return hasEndedFilter && hasOrgFilter && matchesSearch;
      })
      .sort((a, b) => {
        // Sort by active challenges first, then upcoming, then completed/ended
        const now = new Date();
        const aIsActive =
          new Date(a.startDate) <= now && new Date(a.endDate) >= now;
        const bIsActive =
          new Date(b.startDate) <= now && new Date(b.endDate) >= now;

        if (aIsActive && !bIsActive) return -1;
        if (!aIsActive && bIsActive) return 1;

        // Then sort by date
        return (
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      });
  }, [levels, showEnded, selectedOrg, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!levels || !progress) return { active: 0, completed: 0, upcoming: 0 };

    const now = new Date();
    return {
      active: levels.filter(
        (level) =>
          new Date(level.startDate) <= now && new Date(level.endDate) >= now,
      ).length,
      completed: progress.filter((p) => p.completedAt).length,
      upcoming: levels.filter((level) => new Date(level.startDate) > now)
        .length,
    };
  }, [levels, progress]);

  const isLoading =
    levelsLoading ||
    userProgressLoading ||
    levelsFetching ||
    userProgressFetching;
  const isError = levelsError || startLevelError || userProgressError;

  if (startLevelLoading) {
    return <PageLoader overlay />;
  }

  if (isError) {
    navigate('/login/failed');
    return null;
  }

  return (
    <div className="space-y-6 p-4 pb-12">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active</h3>
            <div className="rounded-lg bg-white/20 p-2">
              <CalendarIcon className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {isLoading ? '...' : stats.active}
          </p>
          <p className="mt-1 text-xs opacity-80">Challenges in progress</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Completed</h3>
            <div className="rounded-lg bg-white/20 p-2">
              <TrophyIcon className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {isLoading ? '...' : stats.completed}
          </p>
          <p className="mt-1 text-xs opacity-80">Challenges finished</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Upcoming</h3>
            <div className="rounded-lg bg-white/20 p-2">
              <ClockIcon className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {isLoading ? '...' : stats.upcoming}
          </p>
          <p className="mt-1 text-xs opacity-80">Challenges coming soon</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Orgs</h3>
            <div className="rounded-lg bg-white/20 p-2">
              <AcademicCapIcon className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {isLoading ? '...' : organisations.length}
          </p>
          <p className="mt-1 text-xs opacity-80">Challenge providers</p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mt-4 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-4 w-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              className="block w-full rounded-lg border bg-gray-50 p-3 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Search challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              className={`rounded-lg p-2.5 ${view === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}
              onClick={() => setView('grid')}
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </button>
            <button
              className={`rounded-lg p-2.5 ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}
              onClick={() => setView('list')}
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterPill
            label="Show Ended Challenges"
            isActive={showEnded}
            onClick={() => setShowEnded(!showEnded)}
          />
          {organisations.map((org) => (
            <FilterPill
              key={org}
              label={org}
              isActive={selectedOrg === org}
              onClick={() => setSelectedOrg(selectedOrg === org ? null : org)}
            />
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl bg-gray-800 p-6"
            ></div>
          ))}
        </div>
      )}

      {/* Challenge cards */}
      {!isLoading && (
        <>
          {filteredLevels.length === 0 ? (
            <div className="py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                No challenges found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try changing your search or filter criteria.
              </p>
            </div>
          ) : (
            <div
              className={
                view === 'grid'
                  ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
                  : 'flex flex-col gap-4'
              }
            >
              {filteredLevels.map((level) => (
                <ChallengeCard
                  key={`level-${level._id}`}
                  level={level}
                  progress={progress?.find((p) => p.levelId === level._id)}
                  onStart={() => handleStartChallenge(level._id)}
                  onReset={() => resetChallenge(level._id)}
                  viewMode={view}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChallengesPage;
