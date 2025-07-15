import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../../../components/loaders/PageLoader';
import { PracticeLoader } from '../practice/Practice.loader';
import { LevelGroup } from '../practice/components/LevelGroup';
import { useGetAllLevelsQuery } from '../../../slices/testApi.slice';

export const PracticeLevels = () => {
  const navigate = useNavigate();

  const {
    data: levels,
    isLoading: levelsLoading,
    isError: levelsError,
    isFetching: levelsFetching,
  } = useGetAllLevelsQuery(undefined);

  const handleStartPractice = async (levelId: string): Promise<void> => {
    console.log(levelId);
    try {
      if (levelsLoading) return;

      if (levelId) {
        navigate(`/level/${levelId}`);
        return;
      }
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const isLoading = levelsLoading || levelsFetching;
  const isError = levelsError;

  if (isLoading) {
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
      {/* <TestCard refetch={refetch} /> */}

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
                onStartPractice={handleStartPractice}
                isLoading={levelsFetching}
                isAdmin={false}
              />
            ),
          )
        )}
      </div>
    </div>
  );
};
