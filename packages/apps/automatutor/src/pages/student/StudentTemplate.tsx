import { Outlet } from 'react-router-dom';
import { NavBar } from '../../components';

function StudentTemplate() {
  return (
    <div className="h-screen w-screen flex flex-col dark:bg-gray-900">
      <Outlet />
      <NavBar />
    </div>
  );
}

export default StudentTemplate;
