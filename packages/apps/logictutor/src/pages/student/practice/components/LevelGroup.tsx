import { useState, useRef, useEffect } from 'react';
import { UserProgress } from '@edusoftware/core/src/types';
import { PracticeCard } from './PracticeCard';

const MAX_VISIBLE_INDICATORS = 5;

interface LevelGroupProps {
  difficulty: string;
  levels: any[];
  progress?: UserProgress[];
  onStartPractice: (levelId: string) => void;
  onResetPractice: (levelId: string) => void;
  isLoading?: boolean;
}

export const LevelGroup = ({
  difficulty,
  levels,
  progress,
  onStartPractice,
  onResetPractice,
  isLoading,
}: LevelGroupProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        root: element.parentElement,
        threshold: 0.5,
      },
    );

    const cards = element.getElementsByClassName('carousel-card');
    Array.from(cards).forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [levels]);

  const renderIndicators = () => {
    if (levels.length <= MAX_VISIBLE_INDICATORS) {
      return levels.map((_, index) => (
        <div
          key={index}
          className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${
            index === activeIndex
              ? 'bg-indigo-500'
              : 'bg-gray-300 dark:bg-gray-700'
          }`}
        />
      ));
    }

    // Calculate which dots to show
    const indicators: JSX.Element[] = [];
    const halfway = Math.floor(MAX_VISIBLE_INDICATORS / 2);
    let start = Math.max(0, activeIndex - halfway);
    const end = Math.min(levels.length - 1, start + MAX_VISIBLE_INDICATORS - 1);

    // Adjust start if we're near the end
    if (end - start < MAX_VISIBLE_INDICATORS - 1) {
      start = Math.max(0, end - MAX_VISIBLE_INDICATORS + 1);
    }

    // Add first dot if not at start
    if (start > 0) {
      indicators.push(
        <div
          key="start"
          className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-700"
        />,
      );
    }

    // Add visible dots
    for (let i = start; i <= end; i++) {
      indicators.push(
        <div
          key={i}
          className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${
            i === activeIndex ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-700'
          }`}
        />,
      );
    }

    // Add last dot if not at end
    if (end < levels.length - 1) {
      indicators.push(
        <div
          key="end"
          className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-700"
        />,
      );
    }

    return indicators;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()} Levels
        </h2>
        <div className="flex items-center gap-2 md:hidden">
          {renderIndicators()}
        </div>
      </div>
      <div className="relative">
        <div
          ref={scrollRef}
          className={`scrollbar-hide -mx-6 flex snap-x snap-mandatory space-x-6 overflow-x-auto px-6 pb-6 transition-opacity duration-200 md:mx-0 md:snap-none md:px-0 ${
            isLoading ? 'opacity-50' : 'opacity-100'
          }`}
        >
          {levels.map((level, index) => (
            <div
              key={level._id}
              data-index={index}
              className="carousel-card w-[calc(100vw-3rem)] flex-none snap-center md:w-[350px]"
            >
              <PracticeCard
                levelName={level.levelName}
                description={level.description}
                difficulty={level.difficulty}
                progress={progress?.find((p) => p.levelId === level._id)}
                onClick={() => onStartPractice(level._id)}
                onReset={() => onResetPractice(level._id)}
                levelId={level._id}
              />
            </div>
          ))}
        </div>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/5 dark:bg-gray-900/20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  );
};
