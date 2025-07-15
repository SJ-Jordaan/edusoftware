// import { useState } from 'react';
import { LogictutorCreateLevelRequest } from '@edusoftware/core/src/types';
import { useCreateLogictutorLevelMutation } from '../../slices/testApi.slice';
import { useState } from 'react';
import { parseBooleanExpr } from '@edusoftware/core/src/algorithms';
import { ErrorToast } from '../toasts/ErrorToast';
import { toast } from 'react-toastify';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
interface TestCardProps {
  refetch: () => void; // or Promise<void> if it's async
}

export const CreateLevel = ({ refetch }: TestCardProps) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [levelName, setLevelName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<
    'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  >('BEGINNER');

  const [questions, setQuestions] = useState<
    Array<{
      booleanExpression: string;
      questionContent: string;
      hints: string[];
    }>
  >([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { booleanExpression: '', questionContent: '', hints: [''] },
    ]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, index) => idx !== index));
  };

  const updateQuestionField = (
    index: number,
    field: 'booleanExpression' | 'questionContent',
    value: string,
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
    const updated = [...questions];
    updated[index]['hints'].push('');
    setQuestions(updated);
  };
  const removeHint = (index: number, hintIndex: number) => {
    const updated = [...questions];
    updated[index]['hints'].splice(hintIndex, 1);
    setQuestions(updated);
  };

  const submitLevel = async () => {
    if (!levelName) {
      createErrorToast('A level is required');
      return;
    }
    if (!description) {
      createErrorToast('A level description is required');
      return;
    }
    if (questions.length === 0) {
      createErrorToast('At least one question is required');
      return;
    }
    for (let i = 0; i < questions.length; i++) {
      try {
        parseBooleanExpr(questions[i].booleanExpression.split(''));
      } catch (errorMessage) {
        createErrorToast(
          `Failed to parse boolean expression for question ${i + 1} \n${errorMessage}`,
        );
        return;
      }
      if (!questions[i].questionContent) {
        createErrorToast(
          `Question instruction for question ${i + 1} must not be empty`,
        );
        return;
      }
    }

    const level: LogictutorCreateLevelRequest = {
      levelName: levelName,
      description: description,
      difficulty: difficulty,
      questions: questions.map((question) => {
        return {
          ...question,
          hints: question.hints,
          score: 5,
          answer: '',
        };
      }),
    };
    setIsSubmitting(true);
    try {
      await createLevel(level);
    } catch (error) {
      console.error(error);
      createErrorToast('An error occurred while creating the level');
      return;
    } finally {
      setIsSubmitting(false);
    }

    refetch();
    setLevelName('');
    setDescription('');
    setDifficulty('BEGINNER');
    setQuestions([]);
  };

  const createErrorToast = (message: string) => {
    toast(
      ({ closeToast }) => <ErrorToast message={message} onClose={closeToast} />,
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
  const [createLevel, { isLoading: isCreating, error: createError }] =
    useCreateLogictutorLevelMutation();

  const DifficultySelector = () => {
    const difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;

    return (
      <div className="flex gap-2">
        {difficulties.map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={`h-min rounded-lg px-4 py-2 ${
              difficulty === level
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-800 text-gray-600'
            }`}
          >
            {level}
          </button>
        ))}
      </div>
    );
  };

  const inputClass =
    'h-min w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500';
  return (
    <div className="flex flex-col gap-4 text-white">
      {createError && <div>{createError.toString()}</div>}
      {isCreating && <div>Creating...</div>}
      <div className="flex h-min justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <p className="w-40">Level Name</p>
            <input
              className={inputClass}
              type="text"
              placeholder="Level Name"
              value={levelName}
              onChange={(e) => setLevelName(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <p className="w-40">Description</p>
            <input
              className={inputClass}
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <DifficultySelector />
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          className="w-min text-nowrap rounded-lg bg-indigo-500 px-4 py-2"
          onClick={addQuestion}
        >
          Add Question
        </button>
        <button
          className="w-min text-nowrap rounded-lg bg-indigo-500 px-4 py-2"
          onClick={() => setShowInstructions(!showInstructions)}
        >
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
      {questions.map((question, idx) => (
        <div
          className="flex flex-col gap-4 rounded-xl border-l-8 border-emerald-500 bg-gray-800 p-4 text-white"
          key={idx}
        >
          <div className="flex items-center justify-evenly gap-4">
            {idx + 1}.<p>Boolean Expression</p>
            <input
              className={inputClass}
              type="text"
              placeholder="Boolean Expression"
              value={question.booleanExpression}
              onChange={(e) =>
                updateQuestionField(idx, 'booleanExpression', e.target.value)
              }
            />
            <p>Question Instructions</p>
            <input
              className={inputClass}
              type="text"
              placeholder="Question Instructions"
              value={question.questionContent}
              onChange={(e) =>
                updateQuestionField(idx, 'questionContent', e.target.value)
              }
            />
            <button
              onClick={() => removeQuestion(idx)}
              className=" rounded-full bg-gray-700 p-2 text-gray-300 shadow-md transition hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Delete"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <p>Hints</p>
            <button
              onClick={() => addHint(idx)}
              className="rounded-full bg-gray-700 p-2 text-gray-300 shadow-md transition hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

      <button
        className="m-auto w-min text-nowrap rounded-lg bg-indigo-500 px-4 py-2"
        onClick={submitLevel}
        disabled={isSubmitting}
      >
        Submit Level
      </button>
    </div>
  );
};
