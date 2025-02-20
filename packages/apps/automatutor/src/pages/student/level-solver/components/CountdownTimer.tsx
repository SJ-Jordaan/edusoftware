import { useEffect, useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

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
    if (timeLeft <= 30) return 'text-red-500';
    if (timeLeft <= 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="flex items-center justify-center rounded-lg bg-gray-800 px-4 py-3 shadow-sm">
      <ClockIcon className={`mr-2 h-5 w-5 ${getTimerColor()}`} />
      <span className={`font-mono text-lg font-medium ${getTimerColor()}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};
