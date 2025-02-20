import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { GridAutomatonBuilder } from '../../../components/grid-automaton-builder/GridAutomatonBuilder';
import { PageLoader } from '../../../components/loaders/PageLoader';
import { RegexBuilder } from '../../../components/regex-builder/RegexBuilder';
import { usePreventOverscroll } from '../../../hooks';
import { CountdownTimer } from './components/CountdownTimer';
import { useLevelSolver } from './hooks/useLevelSolver';
import { PopulatedQuestion } from '@edusoftware/core/src/types';
import { DragAndDropProvider } from '../../../components/DragAndDropProvider';

const renderSpecificInterface = ({
  question,
  answer,
  handleAnswerChange,
  isTouch,
}: {
  question: PopulatedQuestion | undefined;
  answer: string;
  handleAnswerChange: (
    newAnswer: { target: { value: string } },
    questionId: string,
  ) => void;
  isTouch?: boolean;
}) => {
  if (!question) {
    return null;
  }

  switch (question.questionType) {
    case 'Regex':
    case 'Regex Equivalence':
    case 'Regex Accepts String':
      return (
        <RegexBuilder
          key={question._id}
          alphabet={question.alphabet?.split('')}
          operators={question.operators ?? []}
          answer={answer}
          onChange={(e) => handleAnswerChange(e, question._id)}
        />
      );

    case 'Construct Automaton':
      return (
        <GridAutomatonBuilder
          key={question._id}
          answer={answer}
          isTouch={isTouch}
        />
      );
    default:
      return null;
  }
};

const LevelSolver = () => {
  const {
    question,
    timeRemaining,
    answer,
    isLoading,
    isError,
    handleSubmit,
    handleAnswerChange,
    handleEndLevel,
  } = useLevelSolver();

  usePreventOverscroll();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <PageLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-900 px-4 text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold text-white">
          Something went wrong
        </h2>
        <p className="mt-2 text-gray-400">
          Unable to load the question. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-lg bg-red-500 px-6 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Reload Page
        </button>
      </div>
    );
  }

  const QuestionInfo = () => (
    <div className="rounded-lg bg-gray-800 p-4 shadow">
      <h3 className="mb-2 text-sm font-medium text-gray-400">Question Info</h3>
      <div className="space-y-4">
        {question?.alphabet && (
          <div>
            <h4 className="mb-2 text-xs font-medium text-gray-500">Alphabet</h4>
            <div className="flex flex-wrap gap-2">
              {question.alphabet.split('').map((char) => (
                <span
                  key={char}
                  className="rounded bg-gray-700 px-2 py-1 text-xs text-white"
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        )}
        {question?.operators && question.operators.length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-medium text-gray-500">
              Operators
            </h4>
            <div className="flex flex-wrap gap-2">
              {question.operators.map((op) => (
                <span
                  key={op}
                  className="rounded bg-gray-700 px-2 py-1 text-xs text-white"
                >
                  {op}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <DragAndDropProvider>
      <div className="min-h-screen bg-gray-900">
        {/* Mobile View (default) */}
        <div className="lg:hidden">
          <div className="px-4 py-6">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6">
                <CountdownTimer
                  initialCount={timeRemaining ?? 0}
                  onEnd={handleEndLevel}
                />
              </div>

              <div className="overflow-hidden rounded-lg bg-gray-800 shadow">
                <div className="px-6 py-4">
                  <p className="whitespace-pre-wrap text-gray-300">
                    {question?.questionContent}
                  </p>
                </div>

                <div className="border-t border-gray-700 bg-gray-800/50 px-6 py-4">
                  {renderSpecificInterface({
                    question,
                    answer,
                    handleAnswerChange,
                    isTouch: true,
                  })}
                </div>
              </div>

              <div className="mt-6">
                <button
                  className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
                  onClick={handleSubmit}
                  disabled={!answer}
                >
                  Submit Answer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="mx-auto max-w-7xl px-8 py-6">
            <div className="grid grid-cols-[1fr_300px] gap-6">
              {/* Main Content */}
              <div>
                <div className="overflow-hidden rounded-lg bg-gray-800 shadow">
                  <div className="border-b border-gray-700 bg-gray-800/50 px-6 py-4">
                    <h2 className="text-lg font-medium text-white">
                      {question?.questionType}
                    </h2>
                  </div>

                  <div className="px-6 py-4">
                    <p className="whitespace-pre-wrap text-gray-300">
                      {question?.questionContent}
                    </p>
                  </div>

                  <div className="border-t border-gray-700 bg-gray-800/50 px-6 py-4">
                    {renderSpecificInterface({
                      question,
                      answer,
                      handleAnswerChange,
                      isTouch: false,
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-800 p-4 shadow">
                  <h3 className="mb-3 text-sm font-medium text-gray-400">
                    Time Remaining
                  </h3>
                  <CountdownTimer
                    initialCount={timeRemaining ?? 0}
                    onEnd={handleEndLevel}
                  />
                </div>
                <QuestionInfo />
                <div className="mt-6 max-w-md">
                  <button
                    className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
                    onClick={handleSubmit}
                    disabled={!answer}
                  >
                    Submit Answer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DragAndDropProvider>
  );
};

export default LevelSolver;
