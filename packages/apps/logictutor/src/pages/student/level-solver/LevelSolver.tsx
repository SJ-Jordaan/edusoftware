import { usePreventOverscroll } from '../../../hooks';
import { CountdownTimer } from './components/CountdownTimer';
import { DragAndDropProvider } from '../../../components/DragAndDropProvider';
import { GridCircuitBuilder } from '../../../components/grid-circuit/GridCircuitBuilder';
import { useEffect, useRef, useState } from 'react';
import { useGetLogictutorLevelQuery } from '../../../slices/levelApi.slice';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import correct from '../../../assets/correct.mp3';
import incorrect from '../../../assets/incorrect.mp3';
import {
  initGrid,
  initToolbar,
} from '../../../components/grid-circuit/gridCircuitSlice';
import {
  generateBooleanExpression,
  generateTruthTable,
  infixToPostfix,
} from '@edusoftware/core/src/algorithms';
import { FeedbackToast } from '../../../components/toasts/FeedbackToast';
import { toast } from 'react-toastify';
import { PageLoader } from '../../../components/loaders/PageLoader';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { InfoToast } from '../../../components/toasts/InfoToast';
import useSound from 'use-sound';
import { CounterExample } from './components/CounterExample';
import { useAddScoreMutation } from '../../../slices/leaderboard.slice';
import { QuestionInfo } from './components/QuestionInfo';

const LevelSolver = () => {
  const dispatch = useAppDispatch();
  const pieces = useAppSelector((state) => state.gridCircuit.pieces);
  const [addScore] = useAddScoreMutation();
  const [incorrectSubmissions, setIncorrectSubmissions] = useState(0);
  const [currentIncorrectSubmissions, setCurrentIncorrectSubmissions] =
    useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (!id) throw new Error('No level id provided');

  const {
    data: level,
    isFetching,
    isLoading,
    isError,
  } = useGetLogictutorLevelQuery(id);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const question = level?.questions[currentQuestion];

  useEffect(() => {
    if (!question || !question.booleanExpression) return;
    if (question.enableToolbar)
      dispatch(
        initToolbar({
          booleanExpression: question.booleanExpression,
          outputSymbol: question.outputSymbol,
        }),
      );
    else
      dispatch(
        initGrid({
          booleanExpression: question.booleanExpression,
          outputSymbol: question.outputSymbol,
        }),
      );
  }, [dispatch, question]);

  const [playCorrect] = useSound(correct, { volume: 0.25 });
  const [playIncorrect] = useSound(incorrect, { volume: 0.25 });

  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Count-up logic
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  });

  usePreventOverscroll();

  const [hintNum, setHintNum] = useState(0);
  const [showCounterExample, setShowCounterExample] = useState(false);
  const [incorrectExpr, setIncorrectExpr] = useState('');

  if (isLoading || isFetching || !question) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <PageLoader message={'Crunching the numbers'} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 text-center">
        <div className="transform opacity-100 transition-all duration-300">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500" />
        </div>
        <div className="transform opacity-100 transition-all duration-300">
          <h2 className="mt-4 text-2xl font-semibold text-white">
            Something went wrong
          </h2>
          <p className="mt-2 text-gray-400">
            Unable to load the question. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-red-500 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-red-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const submitAnswer = async () => {
    if (!question.booleanExpression) return;

    const answerTruthTable = generateTruthTable(
      infixToPostfix(question.booleanExpression.split('')),
    );
    const studentTruthTable = generateTruthTable(
      generateBooleanExpression(pieces),
    );

    const isCorrect = answerTruthTable === studentTruthTable;

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleIncorrectAnswer();
    }
  };

  const handleCorrectAnswer = () => {
    setShowCounterExample(false);
    setCurrentIncorrectSubmissions(0);
    playCorrect();
    setCorrectCount(correctCount + 1);
    showToast({
      isCorrect: true,
      message: 'Correct',
      hint: question.hints?.at(hintNum),
    });

    moveToNextQuestionOrFinish();
  };

  const handleIncorrectAnswer = () => {
    const newIncorrectCount = currentIncorrectSubmissions + 1;
    setIncorrectSubmissions((prev) => prev + 1);
    setCurrentIncorrectSubmissions(newIncorrectCount);

    const maxAttempts = 3;
    const attemptsLeft = maxAttempts - newIncorrectCount;

    if (newIncorrectCount >= maxAttempts) {
      showToast({
        isCorrect: false,
        message: 'Incorrect',
        hint: '3 attempts used. Moving to next question',
      });
      setCurrentIncorrectSubmissions(0);
      moveToNextQuestionOrFinish();
      setIncorrectCount(incorrectCount + 1);
    } else {
      playIncorrect();
      setHintNum((prev) => (prev + 1) % (question.hints?.length ?? 1));
      showToast({
        isCorrect: false,
        message: `Incorrect (${attemptsLeft} left)`,
        hint: question.hints?.at(hintNum),
      });
      setShowCounterExample(true);
      setIncorrectExpr(generateBooleanExpression(pieces));
    }
  };

  const moveToNextQuestionOrFinish = () => {
    const isLastQuestion = level.questions.length === currentQuestion + 1;

    if (isLastQuestion) {
      const score = Math.max(
        (level?.timeLimit ?? 1000) -
          elapsed -
          incorrectSubmissions * 100 +
          correctCount * 150,
        0,
      );
      addScore({ levelId: level._id, score });
      showToast({
        isCorrect: true,
        message: `Your final score is ${score}`,
        hint: '',
      });
      navigate('/challenges');
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const showToast = ({ isCorrect, message, hint }) => {
    toast(
      ({ closeToast }) => (
        <FeedbackToast
          isCorrect={isCorrect}
          message={message}
          onClose={closeToast}
          hint={hint}
        />
      ),
      {
        autoClose: 6000,
        closeButton: false,
        position: 'bottom-center',
        className: 'bg-transparent shadow-none',
        bodyClassName: 'bg-transparent p-0',
        style: { background: 'transparent', boxShadow: 'none' },
      },
    );
  };

  let numCalls = 0;
  const createFailedToast = () => {
    if (numCalls++ !== 0) return;
    toast(
      ({ closeToast }) => (
        <InfoToast
          severity="error"
          errorTitle="Time's Up!"
          message="The time limit expired"
          onClose={closeToast}
        />
      ),
      {
        autoClose: 6000,
        closeButton: false,
        position: 'bottom-center',
        className: 'bg-transparent shadow-none',
        bodyClassName: 'bg-transparent p-0',
        style: { background: 'transparent', boxShadow: 'none' },
      },
    );
  };

  return (
    <DragAndDropProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950">
        {/* Mobile View (default) */}
        <div className="lg:hidden">
          <div className="p-4">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 flex w-full items-center justify-between">
                <div className="w-full text-sm text-gray-400">
                  {level?.timeLimit ? (
                    <CountdownTimer
                      initialCount={level.timeLimit}
                      onEnd={() => {
                        createFailedToast();
                        navigate('/challenges');
                      }}
                    />
                  ) : (
                    <h3 className="mb-3 flex items-center text-sm font-medium text-gray-400">
                      <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-xs">
                        ⏱
                      </span>
                      {level?.timeLimit ? 'Time Remaining' : 'No Time Limit'}
                    </h3>
                  )}
                </div>
              </div>

              <div className="transform overflow-hidden rounded-xl bg-gray-800/70 shadow-xl backdrop-blur-sm transition-all duration-300">
                <div className="w-full border-b border-gray-700/70 bg-gray-800/90 px-5 py-1">
                  <div className="flex w-full items-center justify-center">
                    <h2 className="text-md font-medium text-gray-100">
                      <span className="mr-2 text-xs font-normal text-indigo-400">
                        Build Logic Circuit
                      </span>
                    </h2>
                  </div>
                </div>

                <div className="px-5 py-2">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
                    {question.questionContent}
                  </p>
                </div>

                <div className="border-t border-gray-700/70 bg-gray-800/50 px-5 py-4">
                  <GridCircuitBuilder
                    cellScale={1}
                    enableToolbar={question?.enableToolbar ?? false}
                  />
                </div>
              </div>
              <div className="h-4"></div>
              <QuestionInfo question={question} collapsedDefault={false} />
              <div className="mt-4 flex flex-col gap-4">
                <button
                  className="active:scale-98 w-full transform rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition-all hover:shadow-xl hover:shadow-emerald-900/40 focus:outline-none disabled:from-gray-600 disabled:to-gray-500 disabled:opacity-70"
                  onClick={submitAnswer}
                >
                  Submit Answer
                </button>
                {showCounterExample && (
                  <CounterExample
                    correctExpr={question.booleanExpression}
                    incorrectExpr={incorrectExpr}
                    outputSymbol={question.outputSymbol}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="mx-auto max-w-7xl px-8 py-8">
            <div className="grid grid-cols-[1fr_320px] gap-6">
              {/* Main Content */}
              <div className="transform transition-all duration-300">
                <div className="overflow-hidden rounded-xl bg-gray-800/70 shadow-xl backdrop-blur-sm">
                  <div className="border-b border-gray-700/70 bg-gray-800/90 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-white">
                        <span className="mr-2 text-sm font-normal text-indigo-400">
                          Build Logic Circuit
                        </span>
                      </h2>
                    </div>
                  </div>

                  <div className="px-6 py-5">
                    <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-200">
                      {question.questionContent}
                    </p>
                  </div>

                  <div className="border-t border-gray-700/70 bg-gray-800/50 px-6 py-6">
                    <GridCircuitBuilder
                      cellScale={2}
                      enableToolbar={question?.enableToolbar ?? false}
                    />
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="transform space-y-4 transition-all duration-300">
                <div className="rounded-xl bg-gray-800/70 p-5 shadow-lg backdrop-blur-sm">
                  <h3 className="mb-3 flex items-center text-sm font-medium text-gray-400">
                    <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-xs">
                      ⏱
                    </span>
                    {level?.timeLimit ? 'Time Remaining' : 'No Time Limit'}
                  </h3>
                  {level?.timeLimit && (
                    <CountdownTimer
                      initialCount={level.timeLimit}
                      onEnd={() => {
                        createFailedToast();
                        navigate('/challenges');
                      }}
                    />
                  )}
                </div>
                <QuestionInfo question={question} collapsedDefault={false} />
                <button
                  className="w-full transform rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl focus:outline-none active:scale-[0.98] disabled:from-gray-600 disabled:to-gray-500 disabled:opacity-70"
                  onClick={submitAnswer}
                >
                  Submit Answer
                </button>
                {showCounterExample && (
                  <CounterExample
                    correctExpr={question.booleanExpression}
                    incorrectExpr={incorrectExpr}
                    outputSymbol={question.outputSymbol}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DragAndDropProvider>
  );
};

export default LevelSolver;
