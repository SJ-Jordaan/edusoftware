import { useEffect, useState } from 'react';
import EduSoftware from '../../assets/edusoftware-logo.svg?react';

interface PageLoaderProps {
  overlay?: boolean;
  message?: string;
}

export const PageLoader = ({
  overlay = false,
  message = 'Loading...',
}: PageLoaderProps) => {
  const [loadingDots, setLoadingDots] = useState('');
  const [progress, setProgress] = useState(0);

  // Animate loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prev) => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 8;
        return next > 100 ? 100 : next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-indigo-950 ${
        overlay ? 'z-50' : ''
      }`}
    >
      {/* Center logo section */}
      <div className="flex flex-grow items-center justify-center">
        {/* Animated circular background pulse */}
        <div className="absolute h-64 w-64 animate-ping rounded-full bg-indigo-500/5 duration-1000"></div>
        <div className="absolute h-80 w-80 animate-pulse rounded-full bg-indigo-500/10 delay-300 duration-700"></div>

        {/* Rotating orbital rings */}
        <div className="absolute h-72 w-72 animate-[spin_8s_linear_infinite] rounded-full border border-indigo-500/20"></div>
        <div className="absolute h-56 w-56 animate-[spin_12s_linear_infinite_reverse] rounded-full border border-indigo-300/20"></div>

        {/* Logo container with subtle float animation - exactly in center */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="absolute -inset-4 rounded-full bg-indigo-500/10 blur-xl"></div>
          <div className="relative animate-[float_3s_ease-in-out_infinite]">
            <EduSoftware className="h-36 w-36" />

            {/* Orbital dot animation */}
            <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-5 animate-[orbit_2s_linear_infinite] rounded-full bg-indigo-400"></span>
          </div>

          {/* Loading text - directly under the logo */}
          <div className="text-md fixed bottom-10 mt-8 font-light tracking-wider text-white">
            {message}
            <span className="inline-block w-6 text-indigo-300">
              {loadingDots}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar fixed to bottom */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center">
        <div className="h-1 w-64 overflow-hidden rounded-full bg-gray-700/50">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
