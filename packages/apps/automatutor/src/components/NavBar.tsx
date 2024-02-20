import { useLocation } from 'react-router-dom';
import Home from '../assets/home-icon.svg?react';
import Leaderboard from '../assets/priorities-icon.svg?react';
import Levels from '../assets/edit-list-icon.svg?react';

// TODO: Make generic
const routes = [
  {
    path: '/leaderboard',
    label: 'Leaderboard',
    icon: Leaderboard,
  },
  {
    path: '/',
    label: 'Home',
    icon: Home,
  },
  {
    path: '/levels',
    label: 'Levels',
    icon: Levels,
  },
];

export const NavBar = () => {
  const location = useLocation();

  return (
    <>
      <div className="w-full min-h-14" />
      <div className="flex py-4 bg-gray-500 dark:bg-gray-700 text-white fixed bottom-0 left-0 right-0">
        {routes.map((route, index) => (
          <a
            key={index}
            href={route.path}
            className="flex flex-1 justify-center"
          >
            <route.icon
              className={`w-6 h-6 ${
                location.pathname === route.path
                  ? 'stroke-orange-400 fill-orange-400'
                  : ' stroke-white fill-white'
              }`}
            />
          </a>
        ))}
      </div>
    </>
  );
};
