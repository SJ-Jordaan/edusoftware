import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchLevelsQuery } from '../../../slices/levelApi.slice';
import { PageLoader } from '../../../components/loaders/PageLoader';
import {
  useGetProgressQuery,
  useStartLevelMutation,
} from '../../../slices/progressApi.slice';
import { UserProgress } from '@edusoftware/core/src/types';
import { PracticeLoader } from './Practice.loader';
import { LevelGroup } from './components/LevelGroup';

type Track = 'AUTOMATA' | 'REGEX';

const tracks: { id: Track; name: string; description: string }[] = [
  {
    id: 'AUTOMATA',
    name: 'Automata Theory',
    description:
      'Learn about finite automata, state machines, and formal languages',
  },
  {
    id: 'REGEX',
    name: 'Regular Expressions',
    description:
      'Master pattern matching and text processing with regular expressions',
  },
];

const TrackSelector = ({
  selectedTrack,
  onTrackChange,
}: {
  selectedTrack: Track;
  onTrackChange: (track: Track) => void;
}) => (
  <div className="mb-8">
    <div className="flex flex-col space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => onTrackChange(track.id)}
              className={`relative py-4 text-sm font-medium transition-colors ${
                selectedTrack === track.id
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {track.name}
              {selectedTrack === track.id && (
                <div className="absolute -bottom-px left-0 h-0.5 w-full bg-indigo-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Description for selected track */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Practice {tracks.find((t) => t.id === selectedTrack)?.name}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {tracks.find((t) => t.id === selectedTrack)?.description}
        </p>
      </div>
    </div>
  </div>
);

export const PracticeLevels = () => {
  const [selectedTrack, setSelectedTrack] = useState<Track>('AUTOMATA');
  const navigate = useNavigate();

  const {
    data: levels,
    error: levelsError,
    isLoading: levelsLoading,
    isFetching: levelsFetching,
  } = useFetchLevelsQuery({
    isPractice: true,
    track: selectedTrack,
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
      <TrackSelector
        selectedTrack={selectedTrack}
        onTrackChange={setSelectedTrack}
      />

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
                key={`${selectedTrack}-${difficulty}`}
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
