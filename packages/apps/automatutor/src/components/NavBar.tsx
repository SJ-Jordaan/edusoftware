import { SVGProps, FunctionComponent } from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface Route {
  path: string;
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
}

export const NavBar = ({ routes }: { routes: Route[] }) => {
  const location = useLocation();

  return (
    <>
      <div className="min-h-14 w-full" />
      <div className="fixed bottom-0 left-0 right-0 flex bg-gray-500 py-4 text-white dark:bg-gray-700">
        {routes.map((route, index) => (
          <Link
            key={index}
            to={route.path}
            className="flex flex-1 justify-center"
          >
            <route.icon
              className={`h-6 w-6 ${
                location.pathname === route.path
                  ? 'fill-orange-400 stroke-orange-400'
                  : ' fill-white stroke-white'
              }`}
            />
          </Link>
        ))}
      </div>
    </>
  );
};
