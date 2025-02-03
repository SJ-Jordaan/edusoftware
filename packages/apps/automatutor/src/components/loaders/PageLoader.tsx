import EduSoftware from '../../assets/edusoftware-logo.svg?react';

interface PageLoaderProps {
  overlay?: boolean;
}

export const PageLoader = ({ overlay = false }: PageLoaderProps) => (
  <div
    className={`flex h-screen w-screen flex-col items-center justify-center p-8 dark:bg-gray-900 ${overlay && 'absolute bottom-0 left-0 right-0 top-0 z-50'}`}
  >
    <EduSoftware className="h-36 w-36 animate-bounce" />
  </div>
);
