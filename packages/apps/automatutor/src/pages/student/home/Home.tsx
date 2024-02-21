import { useNavigate } from 'react-router-dom';
import { Tabs } from '../../../components';
import { TABS } from './common/tabs';
import { useAuth } from '../../../slices/auth.slice';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate('/login/unauthorized');
    return;
  }

  return (
    <div className="h-full w-full p-4 space-y-2">
      <div className="w-full flex space-x-4 items-center">
        <img
          className="rounded-full w-20 h-20"
          src={user.picture}
          alt={user.name}
        />
        <div className="text-gray-900 dark:text-gray-50">
          <i>Welcome back to AutomaTutor!</i>
          <p className="text-2xl">{user.name}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>
      <Tabs tabs={TABS} />
    </div>
  );
}

export default Home;
