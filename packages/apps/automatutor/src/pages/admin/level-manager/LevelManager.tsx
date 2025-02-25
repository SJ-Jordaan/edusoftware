import { useNavigate } from 'react-router-dom';
import { CreateLevelModal } from './components/CreateLevelModal';
import { DeleteLevelModal } from './components/DeleteLevelModal';
import { useLevelManagement } from './hooks/useLevelManagement';
import { LevelList } from './components/LevelList';
import { LevelManagerLoader } from './components/LevelManagerLoader';
import ErrorPage from '../../ErrorPage';
import { useState } from 'react';

const LevelManager = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'challenges' | 'practice'>(
    'challenges',
  );
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

  const practiceLevels = levels?.filter((level) => level.isPractice) || [];
  const challengeLevels = levels?.filter((level) => !level.isPractice) || [];

  const statsData = {
    challenges: [
      { title: 'Total Challenges', value: challengeLevels.length },
      {
        title: 'Active Challenges',
        value: challengeLevels.filter(
          (level) => new Date(level.endDate) > new Date(),
        ).length,
      },
      {
        title: 'Upcoming Challenges',
        value: challengeLevels.filter(
          (level) => new Date(level.startDate) > new Date(),
        ).length,
      },
    ],
    practice: [
      {
        title: 'Beginner Levels',
        value: practiceLevels.filter((level) => level.difficulty === 'BEGINNER')
          .length,
      },
      {
        title: 'Intermediate Levels',
        value: practiceLevels.filter(
          (level) => level.difficulty === 'INTERMEDIATE',
        ).length,
      },
      {
        title: 'Advanced Levels',
        value: practiceLevels.filter((level) => level.difficulty === 'ADVANCED')
          .length,
      },
    ],
  };

  if (isLoading) {
    return <LevelManagerLoader />;
  }

  if (isError || !levels) {
    return <ErrorPage buttonText={'Retry'} onClick={() => handleRetry()} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl space-y-8">
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

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: 'challenges', name: 'Challenges' },
              { id: 'practice', name: 'Practice Levels' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as 'challenges' | 'practice')
                }
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300'
                } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {statsData[activeTab].map(({ title, value }) => (
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

        {/* Level Table */}
        <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {activeTab === 'challenges'
                ? 'All Challenges'
                : 'All Practice Levels'}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  {[
                    'Level',
                    'Description',
                    activeTab === 'challenges' ? 'Schedule' : 'Difficulty',
                    'Actions',
                  ].map((header, index) => (
                    <th
                      key={header}
                      scope="col"
                      className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${
                        index === 3 ? 'text-right' : 'text-left'
                      } text-gray-600 dark:text-gray-300`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <LevelList
                  levels={
                    activeTab === 'challenges'
                      ? challengeLevels
                      : practiceLevels
                  }
                  onClick={navigate}
                  onDelete={handleOpenDeleteModal}
                  showSchedule={activeTab === 'challenges'}
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
