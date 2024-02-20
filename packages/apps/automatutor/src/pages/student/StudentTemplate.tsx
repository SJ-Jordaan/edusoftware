import { Outlet } from 'react-router-dom';
import { NavBar } from '../../components';

function StudentTemplate() {
  return (
    <div className="h-screen w-screen flex flex-col dark:bg-slate-800">
      <Outlet />
      <NavBar />
    </div>
  );
}

export default StudentTemplate;
