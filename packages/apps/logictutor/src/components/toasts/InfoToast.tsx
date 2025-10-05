import { FC } from 'react';
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface ErrorToastProps {
  severity: 'info' | 'success' | 'warn' | 'error';
  message: string;
  errorTitle: string;
  onClose: () => void;
}

export const InfoToast: FC<ErrorToastProps> = ({
  severity,
  message,
  errorTitle,
  onClose,
}) => {
  const config = {
    info: {
      icon: <InformationCircleIcon className="h-6 w-6 text-blue-400" />,
      buttonBg: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-800',
    },
    success: {
      icon: <CheckCircleIcon className="h-6 w-6 text-emerald-400" />,
      buttonBg: 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-800',
    },
    warn: {
      icon: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />,
      buttonBg: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-800',
    },
    error: {
      icon: <XCircleIcon className="h-6 w-6 text-red-400" />,
      buttonBg: 'bg-red-500 hover:bg-red-600 focus:ring-red-800',
    },
  }[severity];

  return (
    <div className="flex rounded-lg bg-gray-700 p-4 shadow-md">
      <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
        {config.icon}
      </div>

      <div className="ml-3 text-sm font-normal">
        <span className="mb-1 block text-sm font-semibold text-white">
          {errorTitle}
        </span>
        <div className="mb-2 text-sm font-medium text-gray-400">
          {message.split('\n').map((line, lIndex) => (
            <p key={lIndex}>{line}</p>
          ))}
        </div>

        <div className="mt-3">
          <button
            onClick={onClose}
            className={`inline-flex w-full justify-center rounded-lg px-3 py-1.5 text-center text-xs font-medium text-white focus:outline-none focus:ring-4 ${config.buttonBg}`}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
