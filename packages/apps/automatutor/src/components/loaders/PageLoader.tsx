import EduSoftware from '../../assets/edusoftware-logo.svg?react';

export const PageLoader = () => (
  <div className="flex h-screen w-screen flex-col items-center justify-center p-8 dark:bg-gray-900">
    <EduSoftware className="h-36 w-36 animate-bounce" />
  </div>
);
