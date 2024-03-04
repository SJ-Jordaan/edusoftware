import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../slices/auth.slice';

export const Options = () => {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      {isAdmin && (
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="mb-2 me-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Admin Portal
        </button>
      )}

      <button
        type="button"
        onClick={() => logout()}
        className="mb-2 me-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      >
        Logout
      </button>
    </div>
  );
};
