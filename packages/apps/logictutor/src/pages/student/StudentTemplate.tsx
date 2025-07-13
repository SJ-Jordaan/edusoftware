import { NavBar, Route } from '../../components';

import Home from '../../assets/home-icon.svg?react';
import Practice from '../../assets/four-squares-icon.svg?react';

const routes: Route[] = [
  {
    path: '/',
    icon: Home,
    label: 'Challenges',
  },
  {
    path: '/practice',
    icon: Practice,
    label: 'Practice',
  },
  {
    path: '/temp',
    icon: Practice,
    label: 'Temp',
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
