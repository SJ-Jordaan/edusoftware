import { Outlet } from 'react-router-dom';
import { NavBar, Route } from '../../components';

import Home from '../../assets/home-icon.svg?react';
import Leaderboard from '../../assets/priorities-icon.svg?react';

const routes: Route[] = [
  {
    path: '/',
    icon: Home,
  },
  {
    path: '/leaderboard',
    icon: Leaderboard,
  },
];

function StudentTemplate() {
  return (
    <div className="flex h-screen w-screen flex-col dark:bg-gray-900">
      <Outlet />
      <NavBar routes={routes} />
    </div>
  );
}

export default StudentTemplate;
