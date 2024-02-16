import { AutomatonConverter } from '../../conversions/index.js';
import { Question, QuestionSchema } from '../../types/Question.js';
import { Regex, RegexSchema } from '../../types/RegexInput.js';
import { EvaluationUtils } from '../EvaluationUtils.js';
import { EvaluationStrategy } from './EvaluationStrategy.js';

export class RegexConstructionStrategy implements EvaluationStrategy {
  /**
   * Evaluates the given answer against a set of criteria.
   * @param {Question} question - The question to be evaluated.
   * @param {Regex} userAnswer - The user's answer to the question.
   * @returns {Object} An object indicating if the answer is correct and an optional message.
   */
  evaluate(
    question: Question,
    userAnswer: Regex,
  ): { correct: boolean; message?: string } {
    // Validate the question
    const questionResult = QuestionSchema.safeParse(question);
    if (!questionResult.success) {
      return { correct: false, message: 'Invalid question format.' };
    }

    // Validate the user's answer
    const userAnswerResult = RegexSchema.safeParse(userAnswer);
    if (!userAnswerResult.success) {
      return { correct: false, message: 'User answer must be a regex string.' };
    }

    try {
      const questionAnswerNFA = new AutomatonConverter(
        questionResult.data.answer,
        questionResult.data.alphabet,
      ).convert();

      const userAnswerNFA = new AutomatonConverter(
        userAnswer,
        question.alphabet,
      ).convert();

      return EvaluationUtils.evaluateCounterexamples(
        questionAnswerNFA,
        userAnswerNFA,
      );
    } catch (error: unknown) {
      console.error('Error during NFA conversion or evaluation:', error);

      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? `Conversion or evaluation error: ${error.message}`
          : 'An unexpected error occurred during NFA conversion or evaluation.';

      return {
        correct: false,
        message: errorMessage,
      };
    }
  }
}
