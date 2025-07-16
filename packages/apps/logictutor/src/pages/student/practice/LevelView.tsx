import { useNavigate } from 'react-router-dom';
// import { PageLoader } from '../../../components/loaders/PageLoader';
import { PracticeLoader } from './Practice.loader';
import { LevelGroup } from './components/LevelGroup';
import { useGetAllLevelsQuery } from '../../../slices/testApi.slice';
import { CreateLevel } from '../../../components/create-level';
import CreateModal, {
  useCreateModal,
} from '../../../components/create-level/CreateLevelModal';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface LevelViewProps {
  isAdmin: boolean;
}
export const LevelView = ({ isAdmin }: LevelViewProps) => {
  const navigate = useNavigate();
  const modal = useCreateModal();
  const [levelEditId, setLevelEditId] = useState<string | undefined>(undefined);

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

  const difficultyOrder = { BEGINNER: 'A', INTERMEDIATE: 'B', ADVANCED: 'C' };

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
      {isAdmin && (
        <>
          <CreateModal
            isOpen={modal.isOpen}
            onClose={() => modal.closeModal()}
            title="Create Level"
          >
            <CreateLevel
              refetch={refetch}
              close={modal.closeModal}
              levelId={levelEditId}
            />
          </CreateModal>
          <button
            className="absolute right-0 mr-4 flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-800/30 transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95"
            onClick={() => {
              setLevelEditId(undefined);
              modal.openModal();
              modal.isOpen = true;
            }}
          >
            <PlusIcon className="h-6 w-6" />
            Create Level
          </button>
        </>
      )}

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
          Object.entries(levelsByDifficulty)
            .sort((diffA, diffB) =>
              difficultyOrder[diffA[0]].localeCompare(
                difficultyOrder[diffB[0]],
              ),
            )
            .map(([difficulty, difficultyLevels]) => (
              <LevelGroup
                key={`Logic Gates-${difficulty}`}
                difficulty={difficulty}
                levels={difficultyLevels}
                onStartPractice={handleStartPractice}
                editLevel={(levelId) => {
                  setLevelEditId(levelId);
                  modal.openModal();
                  modal.isOpen = true;
                }}
                isLoading={levelsFetching}
                isAdmin={isAdmin}
              />
            ))
        )}
      </div>
    </div>
  );
};
