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
};

interface ErrorPageProps {
  error?: string;
  title?: string;
  message?: string;
  image?: string;
}

function ErrorPage({
  error = ErrorConfig.TechnicalError.error,
  title = ErrorConfig.TechnicalError.title,
  message = ErrorConfig.TechnicalError.message,
}: ErrorPageProps) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center px-4 py-8 dark:bg-gray-900 gap-4">
      <TechnicalError className="w-64 h-64 fill-gray-900 dark:fill-white" />
      <h2 className="text-2xl font-bold text-blue-500">{error}</h2>
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50">
        {title}
      </h1>
      <p className="text-sm font-normal text-center text-gray-400">{message}</p>
      <button
        onClick={handleGoHome}
        className="bg-logo-primary px-4 py-2 rounded-full text-gray-900 text-sm"
      >
        Go Home
      </button>
    </div>
  );
}

export default ErrorPage;
