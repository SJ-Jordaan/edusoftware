import { useNavigate } from 'react-router-dom';
import TechnicalError from '../assets/Open-Doodles-Messy.svg?react';

export const ErrorConfig = {
  NotFound: {
    error: '404 Not Found',
    title: 'We got a bit lost there!',
    message: 'The page you are looking for does not exist.',
  },
  TechnicalError: {
    error: '500 Internal Error',
    title: 'Oops! Something went wrong',
    message: 'An unexpected error occurred. Please try again later.',
  },
  Unauthorized: {
    error: '401 Unauthorised',
    title: 'Only @tuks.co.za accounts allowed!',
    message:
      'Please sign in with your University of Pretoria Google account to access this page.',
  },
  Forbidden: {
    error: '403 Forbidden',
    title: 'You are not allowed here!',
    message: 'You do not have permission to access this page.',
  },
};

interface ErrorPageProps {
  error?: string;
  title?: string;
  message?: string;
  image?: string;
  buttonText?: string;
  onClick?: () => void;
}

function ErrorPage({
  error = ErrorConfig.TechnicalError.error,
  title = ErrorConfig.TechnicalError.title,
  message = ErrorConfig.TechnicalError.message,
  buttonText = 'Go Home',
  onClick,
}: ErrorPageProps) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (typeof onClick === 'function') {
      onClick();
      return;
    }

    navigate('/');
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-4 px-4 py-8 dark:bg-gray-900">
      <TechnicalError className="h-64 w-64 fill-gray-900 dark:fill-white" />
      <h2 className="text-2xl font-bold text-blue-500">{error}</h2>
      <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50">
        {title}
      </h1>
      <p className="text-center text-sm font-normal text-gray-400">{message}</p>
      <button
        onClick={handleGoHome}
        className="bg-logo-primary rounded-full px-4 py-2 text-sm text-gray-900"
      >
        {buttonText}
      </button>
    </div>
  );
}

export default ErrorPage;
