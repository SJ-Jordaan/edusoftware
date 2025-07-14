import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../../../components/loaders/PageLoader';
import {
  useGetProgressQuery,
  useStartLevelMutation,
} from '../../../slices/progressApi.slice';
import { UserProgress } from '@edusoftware/core/src/types';
import { PracticeLoader } from '../practice/Practice.loader';
import { LevelGroup } from '../practice/components/LevelGroup';
import { TestCard } from '../../../components/test';
import { useGetAllLevelsQuery } from '../../../slices/testApi.slice';

export const Temp = () => {
  const navigate = useNavigate();

  const {
    data: levels,
    isLoading: levelsLoading,
    isError: levelsError,
    isFetching: levelsFetching,
    refetch,
  } = useGetAllLevelsQuery(undefined);

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
    console.log(levelId);
    try {
      if (startLevelLoading) return;

      if (levelId) {
        navigate(`/level/${levelId}`);
        return;
      }
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

  if (isError) {
    navigate('/login/failed');
    return null;
  }

  const levelsByDifficulty = levels?.reduce(
    (acc, level) => {
      if (!acc[level.difficulty]) {
        acc[level.difficulty] = [];
      }
      acc[level.difficulty].push(level);
      return acc;
    },
    {} as Record<string, typeof levels>,
  );

  return (
    <div className="container mx-auto p-6">
      <TestCard refetch={refetch} />

      {/* Level Groups */}
      <div className="space-y-4">
        {isLoading ? (
          // Skeleton loaders for each difficulty level
          <PracticeLoader />
        ) : (
          levelsByDifficulty &&
          Object.entries(levelsByDifficulty).map(
            ([difficulty, difficultyLevels]) => (
              <LevelGroup
                key={`Logic Gates-${difficulty}`}
                difficulty={difficulty}
                levels={difficultyLevels}
                progress={progress}
                onStartPractice={handleStartPractice}
                onResetPractice={handleResetPractice}
                isLoading={levelsFetching}
              />
            ),
          )
        )}
      </div>
    </div>
  );
};
