import { NavBar, Route } from '../../components';

import Home from '../../assets/home-icon.svg?react';
import Leaderboard from '../../assets/priorities-icon.svg?react';
import Practice from '../../assets/four-squares-icon.svg?react';
import Crown from '../../assets/crown-icon.svg?react';

const routes: Route[] = [
  {
    path: '/',
    icon: Home,
    label: 'Challenges',
  },
  {
    path: '/badges',
    icon: Crown,
    label: 'Badges',
  },
  {
    path: '/practice',
    icon: Practice,
    label: 'Practice',
  },
  {
    path: '/leaderboard',
    icon: Leaderboard,
    label: 'Leaderboard',
  },
];

function StudentTemplate() {
  return (
    <div className="min-w-screen flex min-h-screen flex-col dark:bg-gray-900">
      <NavBar routes={routes} />
    </div>
  );
}

export default StudentTemplate;
