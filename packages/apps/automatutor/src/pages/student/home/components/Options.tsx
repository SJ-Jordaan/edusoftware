import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../slices/auth.slice';
import {
  ArrowRightEndOnRectangleIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline';

export const Options = () => {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();

  return (
    <div className="mt-4 w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-lg">
      <h2 className="mb-6 text-xl font-semibold text-white">Account Options</h2>

      <div className="space-y-3">
        {isAdmin && (
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="flex w-full items-center justify-between rounded-lg bg-gray-700 px-4 py-3 text-left text-sm font-medium text-white transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span className="flex items-center gap-3">
              <Cog8ToothIcon className="h-5 w-5 text-gray-400" />
              Admin Portal
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => logout()}
          className="flex w-full items-center justify-between rounded-lg bg-gray-700 px-4 py-3 text-left text-sm font-medium text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <span className="flex items-center gap-3">
            <ArrowRightEndOnRectangleIcon className="h-5 w-5 text-gray-400" />
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
};
