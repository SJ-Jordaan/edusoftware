// import { useState } from 'react';
import {
  LogictutorCreateLevelRequest,
  LogictutorUpdateLevelRequest,
} from '@edusoftware/core/src/types';
import {
  useCreateLogictutorLevelMutation,
  useGetLogictutorLevelQuery,
  useUpdateLogictutorLevelMutation,
} from '../../slices/testApi.slice';
import { useEffect, useState } from 'react';
import { parseBooleanExpr } from '@edusoftware/core/src/algorithms';
import { InfoToast } from '../toasts/InfoToast';
import { toast } from 'react-toastify';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
interface CreateLevelProps {
  refetch: () => void; // or Promise<void> if it's async
  close: () => void; // or Promise<void> if it's async
  levelId?: string;
}
import { skipToken } from '@reduxjs/toolkit/query';

type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export const CreateLevel = ({ refetch, close, levelId }: CreateLevelProps) => {
  const {
    data,
    refetch: refreshFullLevel,
    error,
    isLoading,
    isFetching,
  } = useGetLogictutorLevelQuery(levelId ? levelId : skipToken);

  const [showInstructions, setShowInstructions] = useState(false);
  const [levelName, setLevelName] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState('0:0');
  const [difficulty, setDifficulty] = useState<Difficulty>('BEGINNER');

  const emptyQuestion = {
    booleanExpression: '',
    outputSymbol: '',
    questionContent: '',
    hints: [''],
    enableToolbar: false,
    showTruthTable: false,
  };
  const [questions, setQuestions] = useState<
    Array<{
      booleanExpression: string;
      outputSymbol: string;
      questionContent: string;
      hints: string[];
      enableToolbar: boolean;
      showTruthTable: boolean;
      _id?: string;
    }>
  >([emptyQuestion]);

  useEffect(() => {
    if (data && !error && !isLoading && !isFetching) {
      setLevelName(data.levelName);
      setDescription(data.description);
      setDifficulty(data.difficulty);
      const mins = Math.floor((data.timeLimit ?? 0) / 60);
      const secs = Math.floor((data.timeLimit ?? 0) % 60);
      setTimeLimit(`${mins}:${secs}`);
      setQuestions(
        data.questions.map((q) => {
          return { ...q, hints: q.hints ?? [] };
        }),
      );
    }
  }, [data]);

  const [createLevel, { isLoading: isCreating, error: createError }] =
    useCreateLogictutorLevelMutation();

  const [updateLevel, { isLoading: isUpdating, error: updateError }] =
    useUpdateLogictutorLevelMutation();

  const difficulties = {
    BEGINNER: {
      background: 'bg-emerald-500',
      border: 'border-l-emerald-500',
      label: 'Beginner',
      icon: '🌱',
    },
    INTERMEDIATE: {
      background: 'bg-amber-500',
      border: 'border-l-amber-500',
      label: 'Intermediate',
      icon: '🌿',
    },
    ADVANCED: {
      background: 'bg-red-500',
      border: 'border-l-red-500',
      label: 'Advanced',
      icon: '🌳',
    },
  } as const;

  const addQuestion = () => {
    if (questions.length === 5) {
      createToast('Invalid', 'A maximum of 5 questions are allowed per level');
      return;
    }
    setQuestions([
      ...questions,
      {
        booleanExpression: '',
        questionContent: '',
        hints: [''],
        outputSymbol: '',
        enableToolbar: false,
        showTruthTable: false,
      },
    ]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, index) => idx !== index));
  };

  const updateQuestionField = (
    index: number,
    field: 'booleanExpression' | 'questionContent' | 'outputSymbol',
    value: string,
  ) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateQuestionBoolField = (
    index: number,
    field: 'enableToolbar' | 'showTruthTable',
    value: boolean,
  ) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateHintField = (index: number, hintIndex: number, value: string) => {
    const updated = [...questions];
    updated[index]['hints'][hintIndex] = value;
    setQuestions(updated);
  };
  const addHint = (index: number) => {
    if (questions[index].hints.length === 3) {
      createToast('Invalid', 'A maximum of 3 hints are allowed per question.');
      return;
    }
    const updated = [...questions];
    updated[index]['hints'].push('');
    setQuestions(updated);
  };
  const removeHint = (index: number, hintIndex: number) => {
    const updated = [...questions];
    updated[index]['hints'].splice(hintIndex, 1);
    setQuestions(updated);
  };

  const validateLevel = () => {
    if (!levelName) return 'A level name is required';
    if (!description) return 'A level description is required';

    if (!/^\d+:\d+$/.test(timeLimit)) return 'Time must be in MM:SS format';

    const [minutes, seconds] = timeLimit.split(':').map(Number);
    if (isNaN(minutes) || isNaN(seconds)) return 'Invalid time entered';

    if (questions.length === 0) return 'At least one question is required';
    if (questions.length > 5)
      return 'A maximum of 5 questions are allowed per level';

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.outputSymbol)
        return `Output symbol for question ${i + 1} must not be empty`;

      const numTokens = q.booleanExpression.replace(/[()\s]/g, '').length;
      if (numTokens > 35) {
        return `Boolean expression for question ${i + 1} exceeds maximum token length.\n Current tokens: ${numTokens}\n Max tokens: 35`;
      }

      try {
        parseBooleanExpr(q.booleanExpression.split(''));
      } catch (err) {
        return `Failed to parse boolean expression for question ${i + 1}: ${err}`;
      }

      if (q.booleanExpression.includes(q.outputSymbol)) {
        return `Boolean expression must not contain the output symbol for question ${i + 1}`;
      }

      if (!q.questionContent)
        return `Question instruction for question ${i + 1} must not be empty`;

      if (q.hints.some((hint) => hint === ''))
        return `Empty hints found in question ${i + 1}`;
    }

    return null; // No errors
  };

  const submitLevel = async () => {
    const error = validateLevel();
    if (error) {
      createToast('Invalid', error);
      return;
    }

    const success = levelId
      ? await submitUpdateLevel()
      : await submitCreateLevel();

    if (!success) return;

    refetch();
    close();
  };

  const submitUpdateLevel = async (): Promise<boolean> => {
    const [minutes, seconds] = timeLimit.split(':').map(Number);
    const timeLimitSeconds = minutes * 60 + seconds;

    if (!levelId) {
      createToast('Error', 'Failed to update level');
      refreshFullLevel();
      return false;
    }
    const level: LogictutorUpdateLevelRequest = {
      _id: levelId,
      levelName,
      description,
      difficulty,
      timeLimit: timeLimitSeconds !== 0 ? timeLimitSeconds : undefined,
      questions: questions.map((q) => ({ ...q })),
    };

    try {
      await updateLevel(level);
      if (updateError) throw updateError;
      createToast('Success', 'Level updated successfully', 'success');
      return true;
    } catch (err) {
      console.error(err);
      createToast('Error', 'An error occurred while creating the level');
      return false;
    }
  };

  const submitCreateLevel = async (): Promise<boolean> => {
    const [minutes, seconds] = timeLimit.split(':').map(Number);
    const timeLimitSeconds = minutes * 60 + seconds;

    const level: LogictutorCreateLevelRequest = {
      levelName,
      description,
      difficulty,
      timeLimit: timeLimitSeconds !== 0 ? timeLimitSeconds : undefined,
      questions: questions.map((q) => ({ ...q })),
    };

    try {
      await createLevel(level);
      if (createError) throw createError;
      createToast('Success', 'New level created successfully', 'success');
      return true;
    } catch (err) {
      console.error(err);
      createToast('Error', 'An error occurred while creating the level');
      return false;
    }
  };

  let toastId: ReturnType<typeof toast> | null = null;

  const createToast = (
    errorTitle: string,
    message: string,
    severity: 'info' | 'success' | 'warn' | 'error' = 'error',
  ) => {
    if (toastId && toast.isActive(toastId)) {
      toast.dismiss(toastId);
    }
    toastId = toast(
      ({ closeToast }) => (
        <InfoToast
          severity={severity}
          message={message}
          errorTitle={errorTitle}
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

  const DifficultySelector = () => {
    return (
      <div className="flex flex-wrap gap-2 lg:flex-nowrap">
        {Object.entries(difficulties).map(
          ([level, { background, label, icon }], index) => (
            <button
              key={index}
              onClick={() => setDifficulty(level as Difficulty)}
              className={`h-min rounded-lg px-4 py-2 transition ${
                difficulty === level
                  ? `text-white ${background}`
                  : 'bg-gray-800 text-gray-600'
              }`}
            >
              {label + ' ' + icon}
            </button>
          ),
        )}
      </div>
    );
  };

  const inputClass =
    'h-min w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500';

  if (levelId && (isLoading || isFetching)) {
    return (
      <div
        className="flex max-w-[634px] gap-2 text-white"
        style={{ width: 'calc(100vw - 100px)' }}
      >
        Fetching <ArrowPathIcon className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (levelId && error) {
    return <div className="flex gap-2">Error: Failed to fetch level</div>;
  }

  return (
    <div className="flex flex-col gap-4 text-white">
      {createError && <div>{createError.toString()}</div>}
      {updateError && <div>{updateError.toString()}</div>}
      <div className="flex h-min flex-wrap justify-between gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap">
            <p className="min-w-40">Level Name</p>
            <input
              className={inputClass}
              type="text"
              placeholder="Level Name"
              value={levelName}
              onChange={(e) => setLevelName(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap">
            <p className="min-w-40">Description</p>
            <input
              className={inputClass}
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap">
            <p className="min-w-40">
              Time Limit <span className="text-sm text-gray-500">(0 = ∞)</span>
            </p>
            <input
              className={`${inputClass} !w-32`}
              type="number"
              placeholder="Minutes"
              value={timeLimit.split(':')[0]}
              onChange={(e) => {
                const seconds = timeLimit.split(':')[1];
                setTimeLimit(`${e.target.value}:${seconds}`);
              }}
            />
            :
            <input
              className={`${inputClass} !w-32`}
              type="number"
              placeholder="Seconds"
              value={timeLimit.split(':')[1]}
              onChange={(e) => {
                const minutes = timeLimit.split(':')[0];
                setTimeLimit(`${minutes}:${e.target.value}`);
              }}
            />
          </div>
        </div>
        <DifficultySelector />
      </div>

      <div className="flex justify-center gap-4">
        <button
          className={`flex w-min items-center gap-1 text-nowrap rounded-lg px-4 py-2 ${difficulties[difficulty].background}`}
          onClick={addQuestion}
        >
          <PlusIcon className="h-5 w-5" /> Question
        </button>
        <button
          className="flex w-min items-center gap-1 text-nowrap rounded-lg bg-indigo-500 px-4 py-2"
          onClick={() => setShowInstructions(!showInstructions)}
        >
          <InformationCircleIcon className="h-5 w-5" />
          {showInstructions ? 'Hide' : 'Show'} Instructions
        </button>
      </div>

      {showInstructions && (
        <div>
          <p>
            The input symbols accepted are [a-z] and [A-Z]. Only single
            character symbols are accepted.
          </p>
          <p>
            The following operators are accepted with the listed precedence:
          </p>
          <p className="ml-2">1. NOT: (¬,!)</p>
          <p className="ml-2">2. AND: (·,.,&)</p>
          <p className="ml-2">3. XOR: (⊕,^)</p>
          <p className="ml-2">4. OR: (+,|)</p>
          <p>For example: </p>
          <p>X|Y&(Z^!W)</p>
        </div>
      )}
      <div className="grid max-h-96 gap-4 overflow-y-auto">
        {questions.map((question, idx) => (
          <div
            className="relative flex flex-col gap-4 rounded-xl bg-gray-800 p-4 text-white"
            key={idx}
          >
            <div
              className={`absolute left-0 top-0 h-full w-2 rounded-l-xl transition-all ${difficulties[difficulty].background}`}
            ></div>
            <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap">
              <p className="min-w-40">Question {idx + 1}</p>
              <button
                onClick={() => removeQuestion(idx)}
                className=" rounded-full bg-gray-700 p-2 text-gray-300 shadow-md transition hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Delete"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap">
              <p className="min-w-40">Boolean Expression</p>
              <input
                className={`${inputClass} !w-32`}
                type="text"
                maxLength={1}
                placeholder="Output Symbol"
                value={question.outputSymbol}
                onChange={(e) => {
                  if (/[a-zA-Z]/.test(e.target.value) || e.target.value === '')
                    updateQuestionField(idx, 'outputSymbol', e.target.value);
                }}
              />
              =
              <input
                className={inputClass}
                type="text"
                placeholder="Boolean Expression"
                value={question.booleanExpression}
                onChange={(e) =>
                  updateQuestionField(idx, 'booleanExpression', e.target.value)
                }
              />
            </div>
            <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap">
              <p className="min-w-40">Question Instructions</p>
              <input
                className={inputClass}
                type="text"
                placeholder="Question Instructions"
                value={question.questionContent}
                onChange={(e) =>
                  updateQuestionField(idx, 'questionContent', e.target.value)
                }
              />
            </div>
            <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap">
              <p className="min-w-40">Enable Toolbar</p>
              <input
                type="checkbox"
                checked={question.enableToolbar}
                onChange={(e) =>
                  updateQuestionBoolField(
                    idx,
                    'enableToolbar',
                    e.target.checked,
                  )
                }
                className="h-5 w-5 rounded-lg accent-indigo-500"
              />
              <div className="w-8"></div>
              <p className="min-w-40">Show Truth Table</p>
              <input
                type="checkbox"
                checked={question.showTruthTable}
                onChange={(e) =>
                  updateQuestionBoolField(
                    idx,
                    'showTruthTable',
                    e.target.checked,
                  )
                }
                className="h-5 w-5 rounded-lg accent-indigo-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap">
              <p className="w-40">Hints</p>
              <button
                onClick={() => addHint(idx)}
                className="rounded-full bg-gray-700 p-2 text-gray-300 shadow-md transition hover:bg-emerald-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Add Hint"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>

            {question.hints.map((_, hintIndex) => (
              <div className="flex gap-4" key={hintIndex}>
                <input
                  className={inputClass}
                  type="text"
                  placeholder="Hint"
                  value={question.hints[hintIndex]}
                  onChange={(e) =>
                    updateHintField(idx, hintIndex, e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addHint(idx);
                    }
                    if (
                      e.key === 'Backspace' &&
                      question.hints[hintIndex] === ''
                    ) {
                      removeHint(idx, hintIndex);
                    }
                  }}
                />
                <button
                  onClick={() => removeHint(idx, hintIndex)}
                  className="rounded-full bg-gray-700 p-2 text-gray-300 shadow-md transition hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Delete Hint"
                >
                  <MinusIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          className="
              flex w-min items-center
              gap-2
              rounded-lg bg-gradient-to-r from-emerald-600
              to-green-500 px-4
              py-2 text-sm font-semibold
              text-white shadow-lg
              shadow-emerald-800/30
              transition-all hover:scale-105
              hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500
              focus:ring-offset-2
              active:scale-95
            "
          onClick={submitLevel}
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? (
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <CheckCircleIcon className="h-6 w-6" />
              {levelId ? 'Update' : 'Submit'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
