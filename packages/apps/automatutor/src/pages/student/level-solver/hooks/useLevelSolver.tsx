import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetLevelProgressQuery,
  useSubmitAnswerMutation,
} from '../../../../slices/progressApi.slice';
import { useLayoutEffect, useState } from 'react';
import { useAppSelector } from '../../../../store';
import { isAnswerCorrect } from '@edusoftware/core/src/evaluation/helpers/isAnswerCorrect';

export const useLevelSolver = () => {
  const { id } = useParams<{ id: string }>();
  const gridAutomaton = useAppSelector((state) => state.gridAutomaton.pieces);

  if (!id) throw new Error('No level id provided');

  const navigate = useNavigate();
  const {
    data: level,
    isLoading: levelLoading,
    isError: levelError,
    isFetching: levelFetching,
  } = useGetLevelProgressQuery(id);

  const [submitAnswer, { isLoading: isSubmitting, isError: submitFailed }] =
    useSubmitAnswerMutation();

  const isLoading = levelLoading || isSubmitting || levelFetching;
  const isError = levelError || submitFailed;

  const [answer, setAnswer] = useState('');

  useLayoutEffect(() => {
    if (!level) {
      return;
    }

    if (level.isCompleted) {
      navigate('/');
      return;
    }

    if (!level.question) {
      return;
    }

    setAnswer(level.question.answer);
  }, [level?.isCompleted, level?.question?._id, navigate]);

  const handleSubmit = async () => {
    if (!level || !level.question || !level.question._id) {
      throw new Error('No level provided');
    }

    const finalAnswer =
      level.question.questionType === 'Construct Automaton'
        ? JSON.stringify(gridAutomaton)
        : answer;

    // TODO: Local validation
    const { correct: isCorrect, message } = isAnswerCorrect(
      { ...level.question, answer: level.memo ?? level.question.answer },
      finalAnswer,
    );

    if (!isCorrect) {
      console.log(message);
      return;
    }

    const response = await submitAnswer({
      levelId: id,
      questionId: level.question._id,
      answer: finalAnswer,
    }).unwrap();

    if (!response.isCorrect) {
      console.log(response.message);
      return;
    }

    if (response.isCompleted) {
      navigate('/');
    }
  };

  const handleAnswerChange = (event: { target: { value: string } }) => {
    setAnswer(event.target.value);
  };

  return {
    question: level?.question,
    answer,
    isLoading,
    isError,
    handleSubmit,
    handleAnswerChange,
  };
};
