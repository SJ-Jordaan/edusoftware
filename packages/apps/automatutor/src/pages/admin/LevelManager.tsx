import { useNavigate } from 'react-router-dom';
import { CreateLevelModal } from './components/CreateLevelModal';
import { DeleteLevelModal } from './components/DeleteLevelModal';
import { useLevelManagement } from './hooks/useLevelManagement';
import { LevelList } from './components/LevelList';

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
  } = useLevelManagement();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !levels) {
    return <div>Error</div>;
  }

  return (
    <div className="container mx-auto mt-5">
      <button
        onClick={openCreateModal}
        className="mb-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Create New Level
      </button>
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Level Name
              </th>
              <th scope="col" className="py-3 px-6">
                Description
              </th>
              <th scope="col" className="py-3 px-6">
                Start Date
              </th>
              <th scope="col" className="py-3 px-6">
                End Date
              </th>
              <th scope="col" className="py-3 px-6">
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
