import { QuestionObject } from './../../types/Question';
import { ApplicationError, AutomatonInput } from '../../types';
import { EvaluationContext } from '../EvaluationContext';

export const isAnswerCorrect = (
  question: QuestionObject,
  answer: AutomatonInput,
) => {
  try {
    const evaluationContext = new EvaluationContext(question.questionType);

    return evaluationContext.evaluateQuestion(question, answer);
  } catch (error: unknown) {
    if (error instanceof ApplicationError) {
      throw error;
    }

    if (error instanceof Error) {
      console.error(`Failed to evaluate answer: ${error.message}`);
      throw new Error('Error evaluating answer');
    }

    console.error(`Failed to evaluate answer: ${error}`);
    throw new ApplicationError('Error evaluating answer', 500);
  }
};
