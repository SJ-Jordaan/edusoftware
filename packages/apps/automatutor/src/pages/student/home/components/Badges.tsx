import Mailbox from '../../../../assets/mailbox.svg?react';

export const Badges = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      <Mailbox className="h-60 w-60" />
      <p className="text-gray-900 dark:text-gray-50">
        There are currently no badges available
      </p>
    </div>
  );
};
