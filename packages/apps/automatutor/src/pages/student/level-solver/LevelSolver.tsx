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
    <div className="flex h-full flex-col p-4 dark:bg-slate-800">
      <CountdownTimer initialCount={timeRemaining} onEnd={handleEndLevel} />
      <div className="flex h-full w-full flex-col">
        <p className="dark:text-gray-50">{question?.questionContent}</p>
        <div className="mt-auto" />
        {renderSpecificInterface({
          question: question,
          answer: answer,
          handleAnswerChange,
        })}
        <div className="mt-auto" />
        <button
          className="mt-4 flex w-full items-center justify-center rounded-md bg-green-500 p-2 font-bold text-white"
          onClick={() => handleSubmit()}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default LevelSolver;
