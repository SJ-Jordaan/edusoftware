import { useNavigate } from 'react-router-dom';
import { useFetchLevelsQuery } from '../../../../slices/levelApi.slice';
import {
  useGetProgressQuery,
  useStartLevelMutation,
} from '../../../../slices/progressApi.slice';
import { TimeLineItem } from './TimelineItem';
import { UserProgress } from '@edusoftware/core/src/types';
import { TimelineLoader } from './TimelineLoader';
import { PageLoader } from '../../../../components/loaders/PageLoader';

export const Challenges = () => {
  const navigate = useNavigate();
  const {
    data: levels,
    error: levelsError,
    isLoading: levelsLoading,
    isFetching: levelsFetching,
  } = useFetchLevelsQuery();
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
    <div className="py-4">
      <ol className="relative border-s border-gray-200 dark:border-gray-700">
        {levels?.map((level) => (
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
