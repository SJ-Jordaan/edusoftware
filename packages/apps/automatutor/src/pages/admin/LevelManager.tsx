import { useNavigate } from 'react-router-dom';
import { CreateLevelModal } from './components/CreateLevelModal';
import { DeleteLevelModal } from './components/DeleteLevelModal';
import { useLevelManagement } from './hooks/useLevelManagement';
import { LevelList } from './components/LevelList';
import { LevelManagerLoader } from './components/LevelManagerLoader';
import ErrorPage from '../ErrorPage';

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
    <div className="container mx-auto mt-5">
      <button
        onClick={openCreateModal}
        className="mb-4 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Create New Level
      </button>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Level Name
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Start Date
              </th>
              <th scope="col" className="px-6 py-3">
                End Date
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <LevelList
              levels={levels}
              onClick={navigate}
              onDelete={handleOpenDeleteModal}
            />
          </tbody>
        </table>
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
