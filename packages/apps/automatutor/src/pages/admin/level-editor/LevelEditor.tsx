import { useNavigate, useParams } from 'react-router-dom';
import { useLevelEditor } from './hooks/useLevelEditor';
import { formatDateForInput } from '../common/time';
import { DndProvider } from 'react-dnd';
import { LevelForm } from './components/LevelForm';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Accordion } from '../../../components/Accordion';
import QuestionPosition from './components/QuestionPosition';
import { LevelEditorLoader } from './components/LevelEditorLoader';
import { BackButton } from '../../../components';

const LevelEditor = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const {
    level,
    isLoading,
    isError,
    questions,
    updateEditableAttributes,
    moveQuestion,
    handleUpdateLevel,
  } = useLevelEditor(id);

  if (isLoading) {
    return <LevelEditorLoader />;
  }

  if (isError || !level) {
    return <div>Error</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto space-y-6 p-4 md:p-6">
          {/* Enhanced Header Section */}
          <div className="mb-8 rounded-lg bg-white p-4 shadow-md md:p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BackButton />
              </div>
              <div className="hidden items-center gap-4 md:flex">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated:{' '}
                  {level.updatedAt
                    ? new Date(level.updatedAt).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <LevelForm
            onSubmit={handleUpdateLevel}
            onUpdate={(key, value) =>
              updateEditableAttributes({
                target: { name: key, value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            description={level.description}
            levelName={level.levelName}
            startDate={formatDateForInput(level.startDate)}
            endDate={formatDateForInput(level.endDate)}
            organisation={level.organisation}
          />

          {/* Questions Section with enhanced styling */}
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Questions
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {questions.length} questions in this level
                </p>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={() => navigate(`/admin/levels/${id}/new`)}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Question
              </button>
            </div>

            <Accordion>
              {questions.map((question, index) => (
                <QuestionPosition
                  key={`${question._id}-question-${index}`}
                  index={index}
                  question={question}
                  moveQuestion={moveQuestion}
                  onClick={() =>
                    navigate(`/admin/levels/${id}/${question._id}`)
                  }
                />
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default LevelEditor;
