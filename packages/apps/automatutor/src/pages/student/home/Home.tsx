import { Tabs } from '../../../components';
import { useGetUserInfoQuery } from '../../../slices/userApi.slice';
import { TABS } from './common/tabs';

function Home() {
  const { data: session, isLoading, isError } = useGetUserInfoQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !session) {
    return <div>Error</div>;
  }

  return (
    <div className="h-full w-full p-4">
      <div className="w-full flex space-x-4">
        <img
          className="rounded-full w-20 h-20"
          src={session.picture}
          alt={session.name}
        />
        <div className="text-gray-900 dark:text-gray-50">
          <i>Welcome back to AutomaTutor!</i>
          <p className="text-2xl">{session.name}</p>
          <p className="text-sm text-gray-400">{session.email}</p>
        </div>
      </div>
      <Tabs tabs={TABS} />
    </div>
  );
}

export default Home;
