import { SVGProps, FunctionComponent } from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface Route {
  path: string;
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  label: string;
}

export const NavBar = ({ routes }: { routes: Route[] }) => {
  const location = useLocation();

  return (
    <>
      <div className="min-h-16 w-full" />{' '}
      <nav className="pb-safe fixed bottom-0 left-0 right-0 z-50 border-t border-gray-700 bg-gray-800">
        <div className="mx-auto max-w-md px-4">
          <div className="flex items-center justify-around py-2">
            {routes.map((route, index) => {
              const isActive = location.pathname === route.path;
              return (
                <Link
                  key={index}
                  to={route.path}
                  className="group relative flex flex-col items-center px-4 pt-2"
                >
                  {isActive && (
                    <span className="absolute -top-0.5 h-0.5 w-12 rounded-full bg-orange-400 transition-all" />
                  )}

                  <route.icon
                    className={`duration-600 h-4 w-4 transition-all ${
                      isActive
                        ? 'fill-orange-400 stroke-orange-400'
                        : 'fill-gray-400 stroke-gray-400 group-hover:fill-gray-300 group-hover:stroke-gray-300'
                    }`}
                  />

                  <span
                    className={`mt-1 text-xs transition-all duration-200 ${
                      isActive
                        ? 'text-orange-400'
                        : 'text-gray-400 group-hover:text-gray-300'
                    }`}
                  >
                    {route.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};
