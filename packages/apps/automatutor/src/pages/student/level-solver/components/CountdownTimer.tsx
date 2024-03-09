import { useState, useEffect, useRef } from 'react';
import { TimerContainer } from './TimerContainer';

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
  const [timeLeft, setTimeLeft] = useState(initialCount);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    const clear = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clear();
          if (onEnd) {
            onEnd();
          }
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => {
      isMounted.current = false;
      clear();
    };
  }, [totalCount, onEnd]);

  useEffect(() => {
    if (isMounted.current) {
      setTimeLeft(initialCount);
    }
  }, [initialCount, totalCount]);

  return (
    <TimerContainer
      minutes={Math.floor(timeLeft / 60)}
      seconds={Math.floor(timeLeft % 60)}
    />
  );
};
