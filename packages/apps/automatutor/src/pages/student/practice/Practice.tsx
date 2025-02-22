import { useNavigate } from 'react-router-dom';
import { useFetchLevelsQuery } from '../../../slices/levelApi.slice';
import { TimelineLoader } from '../home/components/TimelineLoader';
import { PageLoader } from '../../../components/loaders/PageLoader';
import {
  useGetProgressQuery,
  useStartLevelMutation,
} from '../../../slices/progressApi.slice';
import { UserProgress } from '@edusoftware/core/src/types';
import { PracticeCard } from './components/PracticeCard';

export const PracticeLevels = () => {
  const navigate = useNavigate();
  const {
    data: levels,
    error: levelsError,
    isLoading: levelsLoading,
    isFetching: levelsFetching,
  } = useFetchLevelsQuery({
    isPractice: true,
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

  const handleStartPractice = async (levelId: string): Promise<void> => {
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

  const handleResetPractice = async (levelId: string) => {
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
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
        Practice Exercises
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {levels?.map((level) => (
          <PracticeCard
            key={level._id}
            levelName={level.levelName}
            description={level.description}
            difficulty={level.difficulty}
            progress={progress?.find((p) => p.levelId === level._id)}
            onClick={() => handleStartPractice(level._id)}
            onReset={() => handleResetPractice(level._id)}
          />
        ))}
      </div>
    </div>
  );
};
