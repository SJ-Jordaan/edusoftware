import { useNavigate } from 'react-router-dom';
import { useFetchLevelsQuery } from '../../../slices/levelApi.slice';
import {
  useGetProgressQuery,
  useStartLevelMutation,
} from '../../../slices/progressApi.slice';
import { TimeLineItem } from './TimelineItem';
import { UserProgress } from '@edusoftware/core/src/types';
import { TimelineLoader } from './TimelineLoader';
import { PageLoader } from '../../../components/loaders/PageLoader';
import { useState, useMemo } from 'react';
import { FilterPill } from '../../../components';

export const Challenges = () => {
  const navigate = useNavigate();
  const [showEnded, setShowEnded] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
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

  // Get unique organizations from levels
  const organizations = useMemo(() => {
    if (!levels) return [];
    return Array.from(
      new Set(levels.map((level) => level.organisation)),
    ).sort();
  }, [levels]);

  // Filter levels based on selected filters
  const filteredLevels = useMemo(() => {
    if (!levels) return [];

    return levels.filter((level) => {
      const hasEndedFilter = showEnded || new Date(level.endDate) > new Date();
      const hasOrgFilter = !selectedOrg || level.organisation === selectedOrg;

      return hasEndedFilter && hasOrgFilter;
    });
  }, [levels, showEnded, selectedOrg]);

  const isLoading =
    levelsLoading ||
    userProgressLoading ||
    levelsFetching ||
    userProgressFetching;
  const isError = levelsError || startLevelError || userProgressError;

  if (startLevelLoading) {
    return <PageLoader overlay />;
  }

  if (isLoading) {
    return (
      <>
        <TimelineLoader animate />
        <TimelineLoader animate />
        <TimelineLoader animate />
      </>
    );
  }

  if (isError) {
    navigate('/login/failed');
    return;
  }

  return (
    <div className="space-y-4 py-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <FilterPill
          label="Show Ended Challenges"
          isActive={showEnded}
          onClick={() => setShowEnded(!showEnded)}
        />
        {organizations.map((org) => (
          <FilterPill
            key={org}
            label={org}
            isActive={selectedOrg === org}
            onClick={() => setSelectedOrg(selectedOrg === org ? null : org)}
          />
        ))}
      </div>

      {/* Timeline */}
      <ol className="relative border-s border-gray-200 dark:border-gray-700">
        {filteredLevels.map((level) => (
          <TimeLineItem
            key={`level-${level._id}`}
            onClick={() => handleStartChallenge(level._id)}
            onReset={() => resetChallenge(level._id)}
            progress={progress?.find((p) => p.levelId === level._id)}
            {...level}
          />
        ))}
      </ol>
    </div>
  );
};
