import { FormEvent, useEffect, useState } from 'react';
import { CheckboxGroup } from './components/CheckboxGroup';
import { HintInput } from './components/HintInput';
import { alphabetOptions, operatorOptions } from '../common/symbols';
import { QuestionType } from '@edusoftware/core/src/types';
import { GridAutomatonBuilder } from '../../../components/grid-automaton-builder/GridAutomatonBuilder';
import { useLevelEditor } from '../level-editor/hooks/useLevelEditor';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../../store';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { BackButton } from '../../../components';
import QuestionEditorLoader from './QuestionEditorLoader';

interface CheckboxOptions {
  [key: string]: boolean;
}

interface QuestionData {
  alphabet: CheckboxOptions;
  operators: CheckboxOptions;
  hints: string[];
  questionType: QuestionType;
  questionContent: string;
  answer: string;
  score: number;
  _id: string;
}

interface ValidationErrors {
  questionType: string | null;
  score: string | null;
  alphabet: string | null;
  questionContent: string | null;
  answer: string | null;
}

const QuestionEditor = () => {
  const { levelId = '', questionId = '' } = useParams();
  const navigate = useNavigate();

  const {
    isLoading,
    isError,
    questions,
    handleSaveQuestion,
    handleDeleteQuestion,
  } = useLevelEditor(levelId);

  const question = questions?.find((question) => question._id === questionId);
  const answer = useAppSelector((state) => state.gridAutomaton.pieces);

  const [questionData, setQuestionData] = useState<QuestionData>({
    questionType: 'Construct Automaton',
    questionContent: '',
    answer: '',
    alphabet: {},
    operators: {},
    hints: [],
    score: 0,
    _id: questionId,
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    questionType: null,
    score: null,
    alphabet: null,
    questionContent: null,
    answer: null,
  });

  useEffect(() => {
    if (!question) {
      return;
    }

    setQuestionData({
      ...question,
      questionType: question.questionType || 'Construct Automaton',
      answer: question.answer ?? '',
      alphabet: alphabetOptions.reduce(
        (acc, letter) => ({
          ...acc,
          [letter]: question.alphabet.includes(letter),
        }),
        {},
      ),
      operators: operatorOptions.reduce(
        (acc, op) => ({
          ...acc,
          [op]: question.operators?.includes(op),
        }),
        {},
      ),
      hints: question.hints ?? [],
    });
  }, [setQuestionData, question]);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;

    setQuestionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleHintChange = (index: number, value: string) => {
    const updatedHints = [...questionData.hints];
    updatedHints[index] = value;
    setQuestionData((prevData) => ({
      ...prevData,
      hints: updatedHints,
    }));
  };

  const handleAddHint = () => {
    setQuestionData((prevData) => ({
      ...prevData,
      hints: [...prevData.hints, ''],
    }));
  };

  const handleRemoveHint = (index: number) => {
    if (!questionData) {
      throw new Error('Question data is undefined');
    }

    const filteredHints = questionData.hints.filter((_, i) => i !== index);
    setQuestionData((prevData) => ({
      ...prevData,
      hints: filteredHints,
    }));
  };

  const handleCheckboxChange = (
    type: 'alphabet' | 'operators',
    value: string,
  ) => {
    setQuestionData((prevData) => {
      if (!prevData) {
        return prevData;
      }

      if (type === 'alphabet' || type === 'operators') {
        const currentOptions = prevData[type];
        const updatedOptions = {
          ...currentOptions,
          [value]: !currentOptions[value],
        };

        return {
          ...prevData,
          [type]: updatedOptions,
        };
      }

      return prevData;
    });
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    if (!questionData) {
      throw new Error('Question Data is undefined');
    }

    // Validate required fields according to schema
    const errors: ValidationErrors = {
      questionType: !questionData.questionType
        ? 'Question type is required'
        : null,
      score: null, // score can be 0 according to schema
      alphabet: !questionData.alphabet
        ? 'At least one symbol is required'
        : null,
      questionContent: !questionData.questionContent.trim()
        ? 'Question content is required'
        : null,
      answer:
        questionData.questionType === 'Construct Automaton'
          ? null
          : !questionData.answer
            ? 'Answer is required'
            : null,
    };

    setValidationErrors(errors);

    if (Object.values(errors).some((error) => error !== null)) {
      return;
    }

    const saveData = {
      ...questionData,
      score: Number(questionData.score),
      // Convert checkbox object to string of selected letters
      alphabet: Object.entries(questionData.alphabet)
        .filter(([, selected]) => selected)
        .map(([letter]) => letter)
        .join(''),
      operators: Object.entries(questionData.operators)
        .filter(([, selected]) => selected)
        .map(([op]) => op),
    };

    if (questionData.questionType === 'Construct Automaton') {
      saveData.answer = JSON.stringify(answer);
    }

    handleSaveQuestion(saveData);
  };

  const handleDelete = async () => {
    if (!questionData) {
      throw new Error('Question Data is undefined');
    }

    await handleDeleteQuestion(questionData._id);
    navigate(-1);
  };

  if (isLoading) {
    return <QuestionEditorLoader />;
  }

  if (isError || !questionData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="rounded-lg bg-white p-8 text-center shadow-md dark:bg-gray-800">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Error Loading Question
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            There was a problem loading the question data. Please try again
            later.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto space-y-6 p-4 md:p-6">
          {/* Header Section */}
          <div className="mb-6 rounded-lg bg-white p-4 shadow-md md:p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BackButton />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {questionId ? 'Edit Question' : 'Create Question'}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 dark:border-red-500/20 dark:bg-gray-800 dark:hover:bg-red-500/10"
                >
                  Delete Question
                </button>
                <button
                  type="submit"
                  onClick={handleSave}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Question Type & Score Section */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <label
                  htmlFor="questionType"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Question Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="questionType"
                  name="questionType"
                  value={questionData.questionType}
                  onChange={handleChange}
                  className={`block w-full rounded-lg border ${
                    validationErrors.questionType
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                  required
                >
                  <option value="">Select a question type</option>
                  <option value="Construct Automaton">
                    Construct Automaton
                  </option>
                  <option value="Regex">Regex</option>
                  <option value="Regex Accepts String">
                    Regex Accepts String
                  </option>
                  <option value="Regex Equivalence">Regex Equivalence</option>
                </select>
                {validationErrors.questionType && (
                  <p className="mt-1 text-sm text-red-500">
                    {validationErrors.questionType}
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <label
                  htmlFor="score"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Score
                </label>
                <input
                  type="number"
                  name="score"
                  id="score"
                  value={questionData.score}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
                {validationErrors.score && (
                  <p className="mt-1 text-sm text-red-500">
                    {validationErrors.score}
                  </p>
                )}
              </div>
            </div>

            {/* Symbols Section */}
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Available Symbols
              </h2>
              <div className="space-y-4">
                <CheckboxGroup
                  options={alphabetOptions}
                  state={questionData.alphabet}
                  onChange={handleCheckboxChange}
                  groupName="alphabet"
                />

                {questionData.questionType !== 'Construct Automaton' && (
                  <CheckboxGroup
                    options={operatorOptions}
                    state={questionData.operators}
                    onChange={handleCheckboxChange}
                    groupName="operators"
                  />
                )}
              </div>
            </div>

            {/* Question Content Section */}
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <label
                htmlFor="questionContent"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Question Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="questionContent"
                name="questionContent"
                value={questionData.questionContent}
                onChange={handleChange}
                rows={4}
                className={`block w-full rounded-lg border ${
                  validationErrors.questionContent
                    ? 'border-red-500'
                    : 'border-gray-300'
                } bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                required
              />
              {validationErrors.questionContent && (
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.questionContent}
                </p>
              )}
            </div>

            {/* Answer Section */}
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Answer
              </h2>
              {questionData.questionType === 'Construct Automaton' ? (
                <GridAutomatonBuilder
                  answer={questionData.answer}
                  alphabet={questionData.alphabet}
                  isEditable
                />
              ) : (
                <input
                  type="text"
                  id="answer"
                  name="answer"
                  value={questionData.answer}
                  onChange={handleChange}
                  className={`block w-full rounded-lg border ${
                    validationErrors.answer
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                  required
                />
              )}
              {validationErrors.answer && (
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.answer}
                </p>
              )}
            </div>

            {/* Hints Section */}
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Hints
                </h2>
                <button
                  type="button"
                  onClick={handleAddHint}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Hint
                </button>
              </div>
              <div className="space-y-4">
                {questionData.hints.map((hint, index) => (
                  <HintInput
                    key={index}
                    hint={hint}
                    index={index}
                    onUpdate={handleHintChange}
                    onRemove={handleRemoveHint}
                  />
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </DndProvider>
  );
};

export default QuestionEditor;
