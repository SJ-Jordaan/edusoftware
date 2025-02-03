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
      <div className="container mx-auto space-y-4 p-4">
        <BackButton />
        <LevelForm
          onSubmit={handleUpdateLevel}
          onUpdate={updateEditableAttributes}
          description={level.description}
          levelName={level.levelName}
          startDate={formatDateForInput(level.startDate)}
          endDate={formatDateForInput(level.endDate)}
        />
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Questions
          </h3>
          <button
            className="rounded-lg bg-green-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={() => navigate(`/admin/levels/${id}/new`)}
          >
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
              onClick={() => navigate(`/admin/levels/${id}/${question._id}`)}
            />
          ))}
        </Accordion>
      </div>
    </DndProvider>
  );
};

export default LevelEditor;
