import { Badge } from '@edusoftware/core/src/types';
import { useFetchBadgesQuery } from '../../../slices/badgeApi.slice';
import Mailbox from '../../../assets/mailbox.svg?react';

export const Badges = () => {
  const { data: badges, isLoading } = useFetchBadgesQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex animate-pulse flex-col items-center space-y-2 rounded-lg bg-gray-800 p-4"
          >
            <div className="h-16 w-16 rounded-full bg-gray-700" />
            <div className="h-4 w-20 rounded bg-gray-700" />
            <div className="h-3 w-24 rounded bg-gray-700" />
          </div>
        ))}
      </div>
    );
  }

  if (!badges?.length) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-4">
        <Mailbox className="h-60 w-60" />
        <p className="text-gray-900 dark:text-gray-50">
          Complete challenges to earn badges!
        </p>
      </div>
    );
  }

  return (
    <div className="my-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {badges.map((badge: Badge) => (
        <div
          key={badge._id}
          className="flex flex-col items-center space-y-2 rounded-lg bg-gray-800 p-4 transition-transform hover:scale-105"
        >
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white p-2">
              <img src={badge.icon} alt={badge.name} className="h-10 w-10" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-gray-800 bg-green-500" />
          </div>
          <h3 className="text-center text-sm font-medium text-white">
            {badge.name}
          </h3>
          <p className="text-center text-xs text-gray-400">
            {badge.description}
          </p>
        </div>
      ))}
    </div>
  );
};
