import { NavBar, Route } from '../../components';

// import Home from '../../assets/home-icon.svg?react';
import Practice from '../../assets/four-squares-icon.svg?react';
import Leaderboard from '../../assets/priorities-icon.svg?react';
import Tutorial from '../../assets/bulb-icon.svg?react';

const routes: Route[] = [
  {
    path: '/challenges',
    icon: Practice,
    label: 'Challenges',
  },
  {
    path: '/leaderboard',
    icon: Leaderboard,
    label: 'Leaderboard',
  },
  {
    path: '/tutorial',
    icon: Tutorial,
    label: 'Tutorial',
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
