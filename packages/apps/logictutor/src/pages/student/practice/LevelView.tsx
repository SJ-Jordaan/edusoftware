import { useNavigate } from 'react-router-dom';
// import { PageLoader } from '../../../components/loaders/PageLoader';
import { PracticeLoader } from './Practice.loader';
import { LevelGroup } from './components/LevelGroup';
import { useGetAllLevelsQuery } from '../../../slices/testApi.slice';
import { CreateLevel } from '../../../components/test';

interface LevelViewProps {
  isAdmin: boolean;
}
export const LevelView = ({ isAdmin }: LevelViewProps) => {
  const navigate = useNavigate();

  const {
    data: levels,
    isLoading: levelsLoading,
    isError: levelsError,
    isFetching: levelsFetching,
    refetch,
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
      {isAdmin && <CreateLevel refetch={refetch} />}

      {/* Level Groups */}
      <div className="space-y-4">
        {isLoading ? (
          <PracticeLoader />
        ) : levelsByDifficulty &&
          Object.keys(levelsByDifficulty).length === 0 ? (
          <p className="mt-8 text-center text-gray-500">
            No levels available yet.
          </p>
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
                isAdmin={isAdmin}
              />
            ),
          )
        )}
      </div>
    </div>
  );
};
