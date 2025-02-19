import { useNavigate } from 'react-router-dom';
import { CreateLevelModal } from './components/CreateLevelModal';
import { DeleteLevelModal } from './components/DeleteLevelModal';
import { useLevelManagement } from './hooks/useLevelManagement';
import { LevelList } from './components/LevelList';
import { LevelManagerLoader } from './components/LevelManagerLoader';
import ErrorPage from '../../ErrorPage';

const LevelManager = () => {
  const navigate = useNavigate();
  const {
    levels,
    isLoading,
    isError,
    isCreateModalOpen,
    isDeleteModalOpen,
    handleCreateLevel,
    handleDeleteLevel,
    handleOpenDeleteModal,
    openCreateModal,
    closeCreateModal,
    closeDeleteModal,
    handleRetry,
  } = useLevelManagement();

  if (isLoading) {
    return <LevelManagerLoader />;
  }

  if (isError || !levels) {
    return <ErrorPage buttonText={'Retry'} onClick={() => handleRetry()} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Level Management
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Manage and organize your educational levels
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
            type="button"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Level
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {[
            { title: 'Total Levels', value: levels.length },
            {
              title: 'Active Levels',
              value: levels.filter(
                (level) => new Date(level.endDate) > new Date(),
              ).length,
            },
            {
              title: 'Upcoming Levels',
              value: levels.filter(
                (level) => new Date(level.startDate) > new Date(),
              ).length,
            },
          ].map(({ title, value }) => (
            <div
              key={title}
              className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800"
            >
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {title}
              </h3>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Table Section */}
        <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              All Levels
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  {['Level', 'Description', 'Schedule', 'Actions'].map(
                    (header, index) => (
                      <th
                        key={header}
                        scope="col"
                        className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${
                          index === 3 ? 'text-right' : 'text-left'
                        } text-gray-600 dark:text-gray-300`}
                      >
                        {header}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <LevelList
                  levels={levels}
                  onClick={navigate}
                  onDelete={handleOpenDeleteModal}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CreateLevelModal
        isOpen={isCreateModalOpen}
        onClick={handleCreateLevel}
        onClose={closeCreateModal}
      />
      <DeleteLevelModal
        isOpen={isDeleteModalOpen}
        onClick={handleDeleteLevel}
        onClose={closeDeleteModal}
      />
    </div>
  );
};

export default LevelManager;
