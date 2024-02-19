import { AutomatonConverter } from '../../conversions';
import {
  AutomatonInput,
  AutomatonInputSchema,
} from '../../types/AutomatonInput';
import { Question, QuestionSchema } from '../../types/Question';
import { EvaluationUtils } from '../EvaluationUtils';
import { EvaluationStrategy } from './EvaluationStrategy.js';

export class AutomatonConstructionStrategy implements EvaluationStrategy {
  /**
   * Evaluates the given answer against a set of criteria.
   * @param {Question} question - The question to be evaluated.
   * @param {AutomatonInput} userAnswer - The user's answer to the question.
   * @returns {Object} An object indicating if the answer is correct and an optional message.
   */
  evaluate(
    question: Question,
    userAnswer: AutomatonInput,
  ): { correct: boolean; message?: string } {
    // Validate the question using Zod
    const questionResult = QuestionSchema.safeParse(question);
    if (!questionResult.success) {
      return {
        correct: false,
        message: 'Question validation failed: Invalid question format.',
      };
    }

    // Validate the user answer using Zod
    const userAnswerResult = AutomatonInputSchema.safeParse(userAnswer);
    if (!userAnswerResult.success) {
      return {
        correct: false,
        message: 'User answer validation failed: Invalid user answer format.',
      };
    }

    try {
      // questionAnswer might be a string or an object
      // userAnswer might be a string or an object

      const questionAnswerNFA = new AutomatonConverter(
        typeof questionResult.data.answer === 'string'
          ? JSON.parse(questionResult.data.answer)
          : questionResult.data.answer,
        questionResult.data.alphabet,
      ).convert();
      const userAnswerNFA = new AutomatonConverter(
        typeof userAnswerResult.data === 'string'
          ? JSON.parse(userAnswerResult.data)
          : userAnswerResult.data,
        questionResult.data.alphabet,
      ).convert();

      // Proceed with evaluating the NFAs
      return EvaluationUtils.evaluateCounterexamples(
        questionAnswerNFA,
        userAnswerNFA,
      );
    } catch (error: unknown) {
      console.error('Error during NFA conversion or evaluation:', error);

      // Provide a generic error message if the specific nature of the error is not discernable
      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? `Conversion error: ${error.message}`
          : 'An unexpected error occurred during NFA conversion or evaluation.';

      return {
        correct: false,
        message: errorMessage,
      };
    }
  }
}
