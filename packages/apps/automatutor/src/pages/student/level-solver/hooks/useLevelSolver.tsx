import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetLevelProgressQuery,
  useSubmitAnswerMutation,
} from '../../../../slices/progressApi.slice';
import { useLayoutEffect, useState } from 'react';
import { useAppSelector } from '../../../../store';
import { isAnswerCorrect } from '@edusoftware/core/src/evaluation/helpers/isAnswerCorrect';
import correct from '../../../../assets/correct.mp3';
import incorrect from '../../../../assets/incorrect.mp3';
import useSound from 'use-sound';
import { toast } from 'react-toastify';
import { FeedbackToast } from '../../../../components/toasts/FeedbackToast';

export const useLevelSolver = () => {
  const { id } = useParams<{ id: string }>();
  const gridAutomaton = useAppSelector((state) => state.gridAutomaton.pieces);
  const [playCorrect] = useSound(correct, { volume: 0.25 });
  const [playIncorrect] = useSound(incorrect, { volume: 0.25 });

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
      if (level.isPractice) {
        navigate('/practice');
        return;
      }

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

    const { correct: isCorrect, message } = isAnswerCorrect(
      { ...level.question, answer: level.memo ?? level.question.answer },
      finalAnswer,
    );

    if (!isCorrect) {
      playIncorrect();
      toast(
        ({ closeToast }) => (
          <FeedbackToast
            isCorrect={false}
            message={message || 'Incorrect answer. Try again.'}
            hint={level.question?.hints?.[0]}
            onClose={closeToast}
          />
        ),
        {
          toastId: `feedback-incorrect-${level.question._id}`,
          autoClose: 6000,
          closeButton: false,
          position: 'bottom-center',
          className: 'bg-transparent shadow-none',
          bodyClassName: 'bg-transparent p-0',
          style: { background: 'transparent', boxShadow: 'none' },
        },
      );
      return;
    }

    const response = await submitAnswer({
      levelId: id,
      questionId: level.question._id,
      answer: finalAnswer,
    }).unwrap();

    if (!response.isCorrect) {
      if (!response.isCompleted) {
        playIncorrect();
        toast(
          ({ closeToast }) => (
            <FeedbackToast
              isCorrect={false}
              message={message || 'Incorrect answer. Try again.'}
              hint={level.question?.hints?.[0]}
              onClose={closeToast}
            />
          ),
          {
            toastId: `feedback-incorrect-${level.question._id}`,
            autoClose: 6000,
            closeButton: false,
            position: 'bottom-center',
            className: 'bg-transparent shadow-none',
            bodyClassName: 'bg-transparent p-0',
            style: { background: 'transparent', boxShadow: 'none' },
          },
        );
      }
      return;
    }

    playCorrect();
    toast(
      ({ closeToast }) => (
        <FeedbackToast
          isCorrect={true}
          message="Correct answer! Well done."
          onClose={closeToast}
        />
      ),
      {
        toastId: `feedback-correct-${level.question._id}`,
        autoClose: 6000,
        closeButton: false,
        position: 'bottom-center',
        className: 'bg-transparent shadow-none',
        bodyClassName: 'bg-transparent p-0',
        style: { background: 'transparent', boxShadow: 'none' },
      },
    );

    if (response.isCompleted) {
      if (level.isPractice) {
        navigate('/practice');
        return;
      }

      navigate('/');
    }
  };

  const handleEndLevel = async () => {
    if (!level || !level.question || !level.question._id) {
      throw new Error('No level provided');
    }

    await submitAnswer({
      levelId: id,
      questionId: level.question._id,
      answer: '',
    });

    navigate('/');
  };

  const handleAnswerChange = (event: { target: { value: string } }) => {
    setAnswer(event.target.value);
  };

  return {
    question: level?.question,
    timeRemaining: level?.timeRemaining,
    answer,
    isLoading,
    isError,
    handleSubmit,
    handleAnswerChange,
    handleEndLevel,
    level,
  };
};
