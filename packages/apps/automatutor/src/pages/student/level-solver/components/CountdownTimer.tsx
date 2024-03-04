import { useState, useEffect, useRef } from 'react';

interface TimerProps {
  totalCount?: number; // Total countdown time
  initialCount?: number; // Initial countdown time left
  onEnd?: () => void;
}

export const CountdownTimer = ({
  initialCount = 60 * 10, // default 10 minutes
  totalCount = 60 * 10, // default total time also 10 minutes
  onEnd,
}: TimerProps) => {
  const [, setTimeLeft] = useState(initialCount);
  const [barWidth, setBarWidth] = useState(
    `${(initialCount / totalCount) * 100}%`,
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        const newWidth = `${(newTime / totalCount) * 100}%`;

        if (isMounted.current) {
          setBarWidth(newWidth);

          if (newTime <= 0) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            if (onEnd) onEnd();
          }
        }

        return newTime;
      });
    }, 1000);

    return () => {
      isMounted.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [totalCount, initialCount, onEnd]);

  useEffect(() => {
    if (isMounted.current) {
      setTimeLeft(initialCount);
      setBarWidth(`${(initialCount / totalCount) * 100}%`);
    }
  }, [initialCount, totalCount]);

  return (
    <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
      <div
        className="h-2.5 rounded-full bg-yellow-400"
        style={{ width: barWidth }}
      ></div>
    </div>
  );
};
