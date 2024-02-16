import {
  AutomatonConverter,
  StandardAlphabetStrategy,
} from '../../conversions';
import { Question, QuestionSchema } from '../../types/Question';
import { RegexString, RegexStringSchema } from '../../types/RegexInput';
import { EvaluationStrategy } from './EvaluationStrategy.js';

export class RegexAcceptanceStrategy implements EvaluationStrategy {
  /**
   * Evaluates the given answer against a set of criteria.
   * @param {Question} question - The question to be evaluated.
   * @param {RegexString} userAnswer - The user's answer to the question.
   * @returns {Object} An object indicating if the answer is correct and an optional message.
   */
  evaluate(
    question: Question,
    userAnswer: RegexString,
  ): { correct: boolean; message?: string } {
    // Validate the question
    const questionResult = QuestionSchema.safeParse(question);
    if (!questionResult.success) {
      return { correct: false, message: 'Invalid question format.' };
    }

    // Validate the user's answer
    const userAnswerResult = RegexStringSchema.safeParse(userAnswer);
    if (!userAnswerResult.success) {
      return { correct: false, message: 'User answer must be a string.' };
    }

    try {
      const regexNFA = new AutomatonConverter(
        questionResult.data.answer,
        questionResult.data.alphabet,
      ).convert();

      const alphabetStrategy = new StandardAlphabetStrategy();
      const normalizedAnswer = alphabetStrategy.normalise(
        userAnswerResult.data,
      );

      if (regexNFA.accepts(normalizedAnswer)) {
        return { correct: true };
      } else {
        return {
          correct: false,
          message: 'The string is not accepted by the regex.',
        };
      }
    } catch (error: unknown) {
      console.error('Error during regex conversion or evaluation:', error);

      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? `Conversion or evaluation error: ${error.message}`
          : 'An unexpected error occurred during regex conversion or evaluation.';

      return {
        correct: false,
        message: errorMessage,
      };
    }
  }
}
