import Mailbox from '../../../assets/mailbox.svg?react';

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      <Mailbox className="h-60 w-60" />
      <p className="text-gray-900 dark:text-gray-50">
        There is currently no data to display on the dashboard
      </p>
    </div>
  );
};

export default Dashboard;
