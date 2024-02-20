import { Outlet } from 'react-router-dom';
import { NavBar } from '../../components';

import Home from '../../assets/home-icon.svg?react';
import Leaderboard from '../../assets/priorities-icon.svg?react';

const routes = [
  {
    path: '/',
    label: 'Home',
    icon: Home,
  },
  {
    path: '/leaderboard',
    label: 'Leaderboard',
    icon: Leaderboard,
  },
];

function StudentTemplate() {
  return (
    <div className="h-screen w-screen flex flex-col dark:bg-gray-900">
      <Outlet />
      <NavBar routes={routes} />
    </div>
  );
}

export default StudentTemplate;
