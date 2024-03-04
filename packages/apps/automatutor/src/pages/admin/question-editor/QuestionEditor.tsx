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

    const saveData = {
      ...questionData,
      score: Number(questionData.score),
      alphabet: Object.keys(questionData.alphabet)
        .filter((letter) => questionData.alphabet[letter])
        .join(''),
      operators: Object.keys(questionData.operators).filter(
        (op) => questionData.operators[op],
      ),
    };

    if (questionData.questionType === 'Construct Automaton') {
      saveData.answer = JSON.stringify(answer);
    }

    setQuestionData((prev) => ({
      ...prev,
      answer: saveData.answer,
    }));

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
    return <div>Loading...</div>;
  }

  if (isError || !questionData) {
    return <div>Error...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto space-y-4 p-4">
        <BackButton />

        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex justify-between">
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Save Question
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Delete Question
            </button>
          </div>
          <div>
            <label
              htmlFor="questionType"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Question Type
            </label>
            <select
              id="questionType"
              name="questionType"
              value={questionData.questionType}
              onChange={handleChange}
              className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white"
            >
              <option value="Construct Automaton">Construct Automaton</option>
              <option value="Regex">Regex</option>
              <option value="Regex Accepts String">Regex Accepts String</option>
              <option value="Regex Equivalence">Regex Equivalence</option>
            </select>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Symbols
            </p>
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
          <div>
            {questionData.questionType === 'Construct Automaton' ? (
              <GridAutomatonBuilder
                answer={questionData.answer}
                alphabet={questionData.alphabet}
                isEditable
              />
            ) : (
              <>
                <label
                  htmlFor="answer"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Answer
                </label>
                <input
                  type="text"
                  id="answer"
                  name="answer"
                  value={questionData.answer}
                  onChange={handleChange}
                  className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                  required
                />
              </>
            )}
          </div>

          <div>
            <label
              htmlFor="questionContent"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Question Content
            </label>
            <textarea
              id="questionContent"
              name="questionContent"
              value={questionData.questionContent}
              onChange={handleChange}
              className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
              required
            />
          </div>
          <div>
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
              className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
              required
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Hints
            </p>

            {questionData.hints.map((hint, index) => (
              <HintInput
                key={index}
                hint={hint}
                index={index}
                onUpdate={handleHintChange}
                onRemove={handleRemoveHint}
              />
            ))}
            <button
              type="button"
              onClick={handleAddHint}
              className="mt-2 rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              Add Hint
            </button>
          </div>
        </form>
      </div>
    </DndProvider>
  );
};

export default QuestionEditor;
