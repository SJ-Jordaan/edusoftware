import { GridAutomatonBuilder } from '../../../components/grid-automaton-builder/GridAutomatonBuilder';
import { PageLoader } from '../../../components/loaders/PageLoader';
import { RegexBuilder } from '../../../components/regex-builder/RegexBuilder';
import { usePreventOverscroll } from '../../../hooks';
import { CountdownTimer } from './components/CountdownTimer';
import { useLevelSolver } from './hooks/useLevelSolver';
import { PopulatedQuestion } from '@edusoftware/core/src/types';

const renderSpecificInterface = ({
  question,
  answer,
  handleAnswerChange,
}: {
  question: PopulatedQuestion | undefined;
  answer: string;
  handleAnswerChange: (
    newAnswer: { target: { value: string } },
    questionId: string,
  ) => void;
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
      return <GridAutomatonBuilder key={question._id} answer={answer} />;
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
    return <PageLoader />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="flex h-full flex-col p-2 py-4 dark:bg-slate-800">
      <CountdownTimer initialCount={timeRemaining} onEnd={handleEndLevel} />
      <div className="mt-4 flex flex-col space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
        <p className="text-lg dark:text-gray-50">{question?.questionContent}</p>
        {renderSpecificInterface({
          question: question,
          answer: answer,
          handleAnswerChange,
        })}
      </div>
      <button
        className="mt-auto w-full rounded-lg border border-gray-200 bg-green-700 px-5 py-2.5 text-sm font-medium text-gray-50 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:border-gray-700 dark:bg-green-800 dark:hover:bg-green-700 dark:focus:ring-green-800"
        onClick={() => handleSubmit()}
      >
        Submit
      </button>
    </div>
  );
};

export default LevelSolver;
