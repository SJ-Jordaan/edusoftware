import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetLevelProgressQuery,
  useSubmitAnswerMutation,
} from '../../../../slices/progressApi.slice';
import { useEffect, useState } from 'react';

export const useLevelSolver = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) throw new Error('No level id provided');

  const navigate = useNavigate();
  const {
    data: level,
    isLoading: levelLoading,
    isError: levelError,
  } = useGetLevelProgressQuery(id);

  const [submitAnswer, { isLoading: isSubmitting, isError: submitFailed }] =
    useSubmitAnswerMutation();

  const isLoading = levelLoading || isSubmitting;
  const isError = levelError || submitFailed;

  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (!level || !level.question || !level.question._id) {
      return;
    }

    if (level.isCompleted) {
      navigate('/');
      return;
    }

    setAnswer(level.question.answer);
  }, [level?.isCompleted, level?.question?._id, navigate]);

  const handleSubmit = async () => {
    if (!level || !level.question || !level.question._id) {
      throw new Error('No level provided');
    }

    const response = await submitAnswer({
      levelId: id,
      questionId: level.question._id,
      answer,
    }).unwrap();

    if (!response.isCorrect) {
      console.log(response.message);
      return;
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
