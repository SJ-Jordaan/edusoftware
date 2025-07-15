import { usePreventOverscroll } from '../../../hooks';
import { CountdownTimer } from './components/CountdownTimer';
import { DragAndDropProvider } from '../../../components/DragAndDropProvider';
import { GridCircuitBuilder } from '../../../components/grid-circuit/GridCircuitBuilder';
import { useEffect, useState } from 'react';
import { useGetLogictutorLevelQuery } from '../../../slices/testApi.slice';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import { initGrid } from '../../../components/grid-circuit/gridCircuitSlice';
import {
  generateBooleanExpression,
  generateTruthTable,
  infixToPostfix,
} from '@edusoftware/core/src/algorithms';
import { FeedbackToast } from '../../../components/toasts/FeedbackToast';
import { toast } from 'react-toastify';
import { PageLoader } from '../../../components/loaders/PageLoader';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const LevelSolver = () => {
  const dispatch = useAppDispatch();

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

  const pieces = useAppSelector((state) => state.gridCircuit.pieces);

  useEffect(() => {
    if (!level?.questions[currentQuestion].booleanExpression) return;
    dispatch(initGrid(level?.questions[currentQuestion].booleanExpression));
  }, [dispatch, level, currentQuestion]);

  usePreventOverscroll();

  const [hintNum, setHintNum] = useState(-1);
  const submitAnswer = () => {
    if (!level?.questions[currentQuestion].booleanExpression) return;
    const answerPostFix = infixToPostfix(
      level?.questions[currentQuestion].booleanExpression.split(''),
    );

    const answerTruthTable = generateTruthTable(answerPostFix);

    const studentAnswerPostFix = generateBooleanExpression(pieces);

    const studentTruthTable = generateTruthTable(studentAnswerPostFix);

    if (answerTruthTable === studentTruthTable) {
      toast(
        ({ closeToast }) => (
          <FeedbackToast
            isCorrect={true}
            message="Correct"
            onClose={closeToast}
            hint={level.questions[currentQuestion].hints?.at(hintNum)}
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
      if (level.questions.length === currentQuestion + 1) navigate('/temp');
      else setCurrentQuestion(currentQuestion + 1);
    } else {
      setHintNum(
        (hintNum + 1) % (level.questions[currentQuestion].hints?.length ?? 1),
      );
      toast(
        ({ closeToast }) => (
          <FeedbackToast
            isCorrect={false}
            message="Incorrect"
            onClose={closeToast}
            hint={level.questions[currentQuestion].hints?.at(hintNum)}
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
    }
  };

  if (isLoading || isFetching) {
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

  // const QuestionInfo = () => (
  //   <div className="hidden rounded-lg bg-gray-800/70 p-4 shadow-lg backdrop-blur-sm transition-all hover:bg-gray-800 lg:block">
  //     <h3 className="mb-3 flex items-center text-sm font-medium text-indigo-400">
  //       <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-xs">
  //         i
  //       </span>
  //       Question Info
  //     </h3>
  //     <div className="space-y-4">
  //       {question?.alphabet && (
  //         <div>
  //           <h4 className="mb-2 text-xs font-medium text-gray-400">Alphabet</h4>
  //           <div className="flex flex-wrap gap-2">
  //             {question.alphabet.split('').map((char) => (
  //               <span
  //                 key={char}
  //                 className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-700 text-xs text-white shadow-inner transition-transform hover:scale-110"
  //               >
  //                 {char}
  //               </span>
  //             ))}
  //           </div>
  //         </div>
  //       )}
  //       {question?.operators && question.operators.length > 0 && (
  //         <div>
  //           <h4 className="mb-2 text-xs font-medium text-gray-400">
  //             Operators
  //           </h4>
  //           <div className="flex flex-wrap gap-2">
  //             {question.operators.map((op) => (
  //               <span
  //                 key={op}
  //                 className="rounded-lg bg-gray-700 px-3 py-1.5 text-xs font-medium text-white shadow-inner transition-transform hover:scale-105"
  //               >
  //                 {op}
  //               </span>
  //             ))}
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );

  return (
    <DragAndDropProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950">
        {/* Mobile View (default) */}
        <div className="lg:hidden">
          <div className="p-4">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 flex w-full items-center justify-between">
                <div className="w-full text-sm text-gray-400">
                  <CountdownTimer
                    initialCount={600}
                    onEnd={() => console.log('ok')}
                  />
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
                    {level?.questions[currentQuestion].questionContent}
                  </p>
                </div>

                <div className="border-t border-gray-700/70 bg-gray-800/50 px-5 py-4">
                  <GridCircuitBuilder />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                Question Info
                <button
                  className="active:scale-98 w-full transform rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition-all hover:shadow-xl hover:shadow-emerald-900/40 focus:outline-none disabled:from-gray-600 disabled:to-gray-500 disabled:opacity-70"
                  onClick={submitAnswer}
                >
                  Submit Answer
                </button>
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
                      {level?.questions[currentQuestion].questionContent}
                    </p>
                  </div>

                  <div className="border-t border-gray-700/70 bg-gray-800/50 px-6 py-6">
                    <GridCircuitBuilder />
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
                    Time Remaining
                  </h3>
                  <CountdownTimer
                    initialCount={600}
                    onEnd={() => console.log('end')}
                  />
                </div>
                Question Info
                <button
                  className="w-full transform rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl focus:outline-none active:scale-[0.98] disabled:from-gray-600 disabled:to-gray-500 disabled:opacity-70"
                  onClick={submitAnswer}
                >
                  Submit Answer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DragAndDropProvider>
  );
};

export default LevelSolver;
