import { useState } from 'react';
import Edusoftware from '../assets/edusoftware-logo.svg?react';
import { Link } from 'react-router-dom';
import { useAuth } from '../slices/auth.slice';

interface SidebarItemProps {
  icon: {
    viewBox: string;
    paths: string[];
  };
  label: string;
  href: string;
  badge?: string;
}

const SidebarItem = ({ icon, label, href, badge }: SidebarItemProps) => (
  <li>
    <Link
      to={href}
      className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
    >
      <svg
        className="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
        aria-hidden="true"
        fill="currentColor"
        viewBox={icon.viewBox}
      >
        {icon.paths.map((path, index) => (
          <path key={index} d={path}></path>
        ))}
      </svg>
      <span className="ms-3 flex-1 whitespace-nowrap">{label}</span>
      {badge && (
        <span className="ms-3 inline-flex items-center justify-center rounded-full bg-gray-100 px-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          {badge}
        </span>
      )}
    </Link>
  </li>
);

interface SidebarProps {
  items: SidebarItemProps[];
}

export const Sidebar = ({ items }: SidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex w-full items-center justify-start rtl:justify-end">
              <button
                onClick={toggleSidebar}
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="h-6 w-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a href="https://edusoftware.net" className="ms-2 flex md:me-24">
                <Edusoftware className="me-3 h-8 w-8" />
                <span className="self-center whitespace-nowrap text-xl font-semibold sm:text-2xl dark:text-white">
                  AutomaTutor
                </span>
              </a>
              <button
                type="button"
                className="ml-auto flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 md:me-0 dark:focus:ring-gray-600"
                id="user-menu-button"
                onClick={() => setShowDropdown((prev) => !prev)}
                data-dropdown-toggle="user-dropdown"
                data-dropdown-placement="bottom"
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.picture}
                  alt="user photo"
                />
              </button>
              <div
                className={`absolute right-0 top-8 z-50 my-4 ${showDropdown ? '' : 'hidden'} list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700`}
                id="user-dropdown"
              >
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">
                    {user?.name}
                  </span>
                  <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <a
                      href="#"
                      onClick={() => logout()}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white pt-20 transition-transform dark:border-gray-700 dark:bg-gray-800 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto bg-white px-3 pb-4 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {items.map((item, index) => (
              <SidebarItem key={index} {...item} />
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};
