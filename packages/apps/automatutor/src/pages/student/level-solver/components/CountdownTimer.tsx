import { useState, useEffect } from 'react';

interface TimerProps {
  initialCount: number;
  onEnd: () => void;
}

export const CountdownTimer = ({ initialCount, onEnd }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialCount);

  useEffect(() => {
    if (timeLeft <= 0) {
      onEnd();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onEnd]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getTimerColor = () => {
    if (timeLeft <= 30) {
      return 'text-red-500';
    } else if (timeLeft <= 120) {
      return 'text-amber-500';
    }
    return 'text-emerald-500';
  };

  const getTimebarWidth = () => {
    const maxTime = 600;
    const percentage = Math.min(100, (timeLeft / maxTime) * 100);
    return `${percentage}%`;
  };

  const getTimebarColor = () => {
    if (timeLeft <= 30) {
      return 'bg-red-500';
    } else if (timeLeft <= 120) {
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
