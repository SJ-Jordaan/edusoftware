import { useState, useEffect, useRef } from 'react';

interface TimerProps {
  initialCount: number;
  onEnd: () => void;
}

export const CountdownTimer = ({ initialCount, onEnd }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialCount);
  const onEndRef = useRef(onEnd);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    if (initialCount === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;

        if (next <= 0) {
          clearInterval(timer);
          onEndRef.current();
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialCount]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getTimerColor = () => {
    if (timeLeft <= initialCount * 0.05) {
      return 'text-red-500';
    } else if (timeLeft <= initialCount * 0.2) {
      return 'text-amber-500';
    }
    return 'text-emerald-500';
  };

  const getTimebarWidth = () => {
    if (initialCount === 0) return '0%';
    const percentage = (timeLeft / initialCount) * 100;
    return `${Math.max(0, Math.min(100, percentage))}%`;
  };

  const getTimebarColor = () => {
    if (timeLeft <= initialCount * 0.05) {
      return 'bg-red-500';
    } else if (timeLeft <= initialCount * 0.2) {
      return 'bg-amber-500';
    }
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div
          className={`text-2xl font-bold tracking-wide ${getTimerColor()} transition-colors duration-300`}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
        <div
          className={`h-full ${getTimebarColor()} transition-all duration-1000 ease-linear`}
          style={{ width: getTimebarWidth() }}
        ></div>
      </div>
    </div>
  );
};
