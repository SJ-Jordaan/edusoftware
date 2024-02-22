import {
  PopulatedLevelObject,
  QuestionObject,
  QuestionType,
} from '@edusoftware/core/src/types';
import {
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
  useFetchLevelQuery,
  useUpdateLevelMutation,
  useUpdateQuestionMutation,
} from '../../../slices/levelApi.slice';
import { ChangeEvent, useEffect, useState } from 'react';
import { formatDateForInput } from '../common/time';

export interface QuestionBuilderObject {
  questionType: QuestionType;
  questionContent: string;
  answer: string;
  alphabet: string[];
  operators: string[];
  score: number;
  hints?: string[];
  _id: string;
}

export const useLevelEditor = (id: string) => {
  const [editableQuestions, setEditableQuestions] = useState<
    QuestionBuilderObject[]
  >([]);
  const [editableLevel, setEditableLevel] =
    useState<PopulatedLevelObject | null>(null);

  const {
    data: level,
    isLoading: isLevelLoading,
    isFetching: isLevelFetching,
    error: levelError,
  } = useFetchLevelQuery(id);
  const [updateLevel, { isLoading: isUpdating, error: updateError }] =
    useUpdateLevelMutation();
  const [createQuestion, { isLoading: isCreating, error: createError }] =
    useCreateQuestionMutation();
  const [
    updateQuestion,
    { isLoading: isUpdatingQuestion, error: updateQuestionError },
  ] = useUpdateQuestionMutation();
  const [deleteQuestion, { isLoading: isDeleting, error: deleteError }] =
    useDeleteQuestionMutation();

  useEffect(() => {
    if (!level) {
      return;
    }

    const startDateTimeLocal = formatDateForInput(level.startDate);
    const endDateTimeLocal = formatDateForInput(level.endDate);
    setEditableLevel((prevLevel) => ({
      ...prevLevel,
      ...level,
      startDate: startDateTimeLocal,
      endDate: endDateTimeLocal,
    }));

    setEditableQuestions(
      level.questionIds?.map((q) => ({
        ...q,
        alphabet: q.alphabet.split(''),
        operators: q.operators ?? [],
      })) ?? [],
    );
  }, [level]);

  const handleSaveQuestion = async (questionData: QuestionObject) => {
    try {
      if (questionData._id) {
        await updateQuestion({ questionId: questionData._id, ...questionData });
        return;
      }

      if (!level) {
        throw new Error('Level not found');
      }

      const question = await createQuestion(questionData).unwrap();

      const questionIds = level.questionIds
        ? level.questionIds.map((q) => q._id)
        : [];

      await updateLevel({
        levelId: id,
        level: {
          questionIds: [question._id, ...questionIds],
        },
      });
    } catch (error) {
      // TODO: Proper error handling
      console.error('Failed to create question', error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!level || isDeleting) return;

    if (!level.questionIds?.find((q) => q._id === questionId)) {
      setEditableQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q._id !== questionId),
      );
      return;
    }

    try {
      await deleteQuestion(questionId);
    } catch (error) {
      // TODO: Proper error handling
      console.error('Failed to delete question', error);
    }
  };

  const moveQuestion = (dragIndex: number, hoverIndex: number) => {
    const dragQuestion = editableQuestions[dragIndex];
    const updatedQuestions = [...editableQuestions];
    updatedQuestions.splice(dragIndex, 1); // Remove the dragged item
    updatedQuestions.splice(hoverIndex, 0, dragQuestion); // Insert it at the new position
    setEditableQuestions(updatedQuestions);
  };

  const updateEditableAttributes = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setEditableLevel((prevLevel) => {
      if (!prevLevel) {
        return null;
      }

      return {
        ...prevLevel,
        [name]: value,
      };
    });
  };

  const handleUpdateLevel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editableLevel) {
      return;
    }

    try {
      await updateLevel({
        levelId: id,
        level: {
          levelName: editableLevel.levelName,
          description: editableLevel.description,
          startDate: new Date(editableLevel.startDate).toISOString(),
          endDate: new Date(editableLevel.endDate).toISOString(),
          questionIds: editableQuestions.map((q) => q._id),
        },
      });
    } catch (error) {
      // TODO: Proper error handling
      console.error('Failed to update level', error);
    }
  };

  const handleAddQuestion = () => {
    setEditableQuestions((prevQuestions) => [
      {
        questionType: 'Construct Automaton',
        questionContent: 'New Question',
        answer: '',
        alphabet: [],
        operators: [],
        score: 100,
        _id: `new-question-${prevQuestions.length}`,
      },
      ...prevQuestions,
    ]);
  };

  const isLoading =
    isLevelLoading ||
    isUpdating ||
    isCreating ||
    isDeleting ||
    isLevelFetching ||
    isUpdatingQuestion;

  const isError = Boolean(
    levelError ??
      updateError ??
      createError ??
      deleteError ??
      updateQuestionError,
  );

  return {
    level: editableLevel,
    isLoading,
    isError,
    handleSaveQuestion,
    handleDeleteQuestion,
    questions: editableQuestions,
    handleUpdateLevel,
    handleAddQuestion,
    updateEditableAttributes,
    moveQuestion,
    setEditableQuestions,
  };
};
