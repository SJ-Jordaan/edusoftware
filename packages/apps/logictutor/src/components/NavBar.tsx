import {
  SVGProps,
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../slices/auth.slice';
import {
  ArrowRightEndOnRectangleIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline';

export interface Route {
  path: string;
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  label: string;
}

/**
 * NavBar Component
 *
 * A responsive navigation bar that adapts between mobile and desktop layouts
 * automatically using Tailwind's responsive utilities.
 */
export const NavBar = ({ routes }: { routes: Route[] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAdmin, user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<null | {
    type: string;
    path?: string;
  }>(null);

  // Separate refs for desktop and mobile menus
  const desktopProfileMenuRef = useRef<HTMLDivElement>(null);
  const desktopProfileButtonRef = useRef<HTMLButtonElement>(null);
  const mobileProfileMenuRef = useRef<HTMLDivElement>(null);
  const mobileProfileButtonRef = useRef<HTMLButtonElement>(null);

  // Process any pending actions
  useEffect(() => {
    if (!profileOpen && pendingAction) {
      // Small delay to ensure state has settled
      const timer = setTimeout(() => {
        if (pendingAction.type === 'navigate' && pendingAction.path) {
          navigate(pendingAction.path);
        } else if (pendingAction.type === 'logout') {
          logout();
        }
        setPendingAction(null);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [profileOpen, pendingAction, navigate, logout]);

  // Handle menu actions safely
  const handleMenuAction = useCallback((actionType: string, path?: string) => {
    setPendingAction({ type: actionType, path });
    setProfileOpen(false);
  }, []);

  // Handle click outside for desktop menu
  const handleDesktopClickOutside = useCallback((event: MouseEvent) => {
    if (
      desktopProfileMenuRef.current &&
      desktopProfileButtonRef.current &&
      !desktopProfileMenuRef.current.contains(event.target as Node) &&
      !desktopProfileButtonRef.current.contains(event.target as Node)
    ) {
      setProfileOpen(false);
    }
  }, []);

  // Handle click outside for mobile menu
  const handleMobileClickOutside = useCallback((event: MouseEvent) => {
    if (
      mobileProfileMenuRef.current &&
      mobileProfileButtonRef.current &&
      !mobileProfileMenuRef.current.contains(event.target as Node) &&
      !mobileProfileButtonRef.current.contains(event.target as Node)
    ) {
      setProfileOpen(false);
    }
  }, []);

  // Add/remove event listeners
  useEffect(() => {
    if (profileOpen) {
      // Add appropriate handlers based on viewport size
      if (window.innerWidth >= 1024) {
        document.addEventListener('mousedown', handleDesktopClickOutside);
      } else {
        document.addEventListener('mousedown', handleMobileClickOutside);
      }
    } else {
      // Remove both handlers to be safe
      document.removeEventListener('mousedown', handleDesktopClickOutside);
      document.removeEventListener('mousedown', handleMobileClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleDesktopClickOutside);
      document.removeEventListener('mousedown', handleMobileClickOutside);
    };
  }, [profileOpen, handleDesktopClickOutside, handleMobileClickOutside]);

  // Close dropdown when route changes
  useEffect(() => {
    setProfileOpen(false);
    setPendingAction(null);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar - Hidden on mobile, visible on lg and above */}
      <aside
        className="fixed bottom-0 left-0 top-0 z-40 hidden border-r border-slate-700
                  bg-slate-900 shadow-xl transition-all duration-300 ease-in-out lg:block
                  lg:w-64"
        aria-label="Main navigation"
      >
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="flex items-center border-b border-slate-700 p-4">
            <h1 className="text-xl font-bold text-white">LogicTutor</h1>
          </div>

          {/* User Welcome Section */}
          {user && (
            <div className="border-b border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <img
                  src={user.picture}
                  alt={`${user.name}'s profile`}
                  className="h-16 w-16 rounded-full border-2 border-orange-400 object-cover"
                />
                <div>
                  <p className="text-xs text-slate-400">Welcome back!</p>
                  <p className="max-w-[140px] truncate text-base font-medium text-white">
                    {user.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav
            className="flex-grow overflow-y-auto py-6"
            aria-label="Sidebar navigation"
          >
            <ul className="space-y-1 px-3">
              {routes.map((route) => {
                const isActive = location.pathname === route.path;
                return (
                  <li key={route.path}>
                    <Link
                      to={route.path}
                      className={`group relative flex items-center gap-3 rounded-lg px-4 py-3 
                                transition-all duration-200 ${
                                  isActive
                                    ? 'bg-orange-400/20 text-orange-400'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {isActive && (
                        <span className="absolute bottom-0 left-0 top-0 w-1 rounded-r-full bg-orange-400" />
                      )}
                      <route.icon
                        className={`h-5 w-5 flex-shrink-0 ${
                          isActive
                            ? 'fill-orange-400'
                            : 'fill-slate-400 group-hover:fill-white'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="font-medium">{route.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Profile Section */}
          <div className="relative border-t border-slate-700 p-4">
            <button
              ref={desktopProfileButtonRef}
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex w-full items-center justify-between rounded-lg p-2 
                        text-slate-200 transition-all hover:bg-slate-800"
              aria-expanded={profileOpen}
              aria-haspopup="true"
              aria-controls="desktop-profile-menu"
            >
              <div className="flex items-center gap-3">
                {user && (
                  <img
                    src={user.picture}
                    alt=""
                    className="h-8 w-8 rounded-full border border-slate-600 object-cover"
                  />
                )}
                <span className="text-sm font-medium">Profile & Settings</span>
              </div>
              <svg
                className={`h-5 w-5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Desktop Profile Menu */}
            <div
              ref={desktopProfileMenuRef}
              id="desktop-profile-menu"
              className={`absolute bottom-full left-0 z-50 mb-2 w-full rounded-md 
                        bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 
                        transition-all duration-200 focus:outline-none
                        ${
                          profileOpen
                            ? 'scale-100 opacity-100'
                            : 'pointer-events-none scale-95 opacity-0'
                        }`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="profile-button"
            >
              {user && (
                <div className="border-b border-slate-700 p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.picture}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.name}
                      </p>
                      <p className="max-w-[200px] truncate text-xs text-slate-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-2">
                {isAdmin && (
                  <MenuButton
                    icon={<Cog8ToothIcon className="h-5 w-5 text-slate-400" />}
                    label="Admin Portal"
                    onClick={() => handleMenuAction('navigate', '/admin')}
                  />
                )}

                <MenuButton
                  icon={
                    <ArrowRightEndOnRectangleIcon className="h-5 w-5 text-slate-400" />
                  }
                  label="Sign Out"
                  onClick={() => handleMenuAction('logout')}
                  className="text-slate-200 hover:bg-red-700 hover:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header - Visible on small screens, hidden on lg and above */}
      <header
        className="fixed left-0 right-0 top-0 z-40 border-b border-slate-700 bg-slate-900 
                      shadow-md lg:hidden"
      >
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold text-white">LogicTutor</h1>
          <div className="relative">
            <button
              ref={mobileProfileButtonRef}
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex h-9 w-9 items-center justify-center overflow-hidden 
                       rounded-full border-2 border-orange-400 focus:outline-none 
                       focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 
                       focus-visible:ring-offset-slate-900"
              aria-expanded={profileOpen}
              aria-haspopup="true"
              aria-controls="mobile-profile-menu"
            >
              {user && (
                <img
                  src={user.picture}
                  alt={`${user.name}'s profile menu`}
                  className="h-full w-full object-cover"
                />
              )}
            </button>

            {/* Mobile Profile Menu */}
            <div
              ref={mobileProfileMenuRef}
              id="mobile-profile-menu"
              className={`absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-md 
                        bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 
                        transition-all duration-200 focus:outline-none
                        ${
                          profileOpen
                            ? 'scale-100 opacity-100'
                            : 'pointer-events-none scale-95 opacity-0'
                        }`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="profile-button"
            >
              {user && (
                <div className="border-b border-slate-700 p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.picture}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.name}
                      </p>
                      <p className="max-w-[200px] truncate text-xs text-slate-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-2">
                {isAdmin && (
                  <MenuButton
                    icon={<Cog8ToothIcon className="h-5 w-5 text-slate-400" />}
                    label="Admin Portal"
                    onClick={() => handleMenuAction('navigate', '/admin')}
                  />
                )}

                <MenuButton
                  icon={
                    <ArrowRightEndOnRectangleIcon className="h-5 w-5 text-slate-400" />
                  }
                  label="Sign Out"
                  onClick={() => handleMenuAction('logout')}
                  className="text-slate-200 hover:bg-red-700 hover:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={'flex-1 overflow-auto bg-slate-900 pt-16 lg:ml-64 lg:pt-0'}
      >
        <div className="container mx-auto mb-14 max-w-6xl lg:mb-0">
          <Outlet />
        </div>
      </main>

      {/* Mobile Navigation - Visible on small screens, hidden on lg and above */}
      <nav
        className="pb-safe fixed bottom-0 left-0 right-0 z-40 border-t 
                 border-slate-700 bg-slate-800/95 shadow-lg 
                 backdrop-blur-lg lg:hidden"
        aria-label="Mobile navigation"
      >
        <div className="mx-auto max-w-lg px-4">
          <div className="flex items-center justify-around py-2">
            {routes.map((route) => {
              const isActive = location.pathname === route.path;
              return (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`group flex flex-col items-center rounded-md px-3 py-2 
                           transition-all duration-300 ease-in-out
                           ${isActive ? 'translate-y-[-4px]' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="relative">
                    {isActive && (
                      <span
                        className="absolute inset-0 scale-150 animate-pulse rounded-full 
                                bg-orange-400/20"
                        aria-hidden="true"
                      />
                    )}
                    <route.icon
                      className={`h-5 w-5 transition-colors ${
                        isActive
                          ? 'fill-orange-400'
                          : 'fill-slate-400 group-hover:fill-slate-200'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <span
                    className={`mt-1 text-xs font-medium ${
                      isActive
                        ? 'text-orange-400'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {route.label}
                  </span>
                  {isActive && (
                    <span
                      className="absolute -bottom-1 h-1 w-12 rounded-full bg-orange-400"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

// Menu Button Component for consistency
interface MenuButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

const MenuButton = ({
  icon,
  label,
  onClick,
  className = 'text-slate-200 hover:bg-slate-700',
}: MenuButtonProps) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm 
               transition-colors ${className}`}
    role="menuitem"
  >
    {icon}
    {label}
  </button>
);

export default NavBar;
