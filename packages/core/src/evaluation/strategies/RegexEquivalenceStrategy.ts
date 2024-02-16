import { StandardAlphabetStrategy } from '../../conversions/index.js';
import { Question, QuestionSchema } from '../../types/Question.js';
import { Regex, RegexSchema } from '../../types/RegexInput.js';
import { EvaluationStrategy } from './EvaluationStrategy.js';
import { RegexConstructionStrategy } from './RegexConstructionStrategy.js';

export class RegexEquivalenceStrategy implements EvaluationStrategy {
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
    // Validate the question using Zod
    const questionResult = QuestionSchema.safeParse(question);
    if (!questionResult.success) {
      return {
        correct: false,
        message: 'Question validation failed: Invalid question format.',
      };
    }

    // Validate the user answer using Zod
    const userAnswerResult = RegexSchema.safeParse(userAnswer);
    if (!userAnswerResult.success) {
      return {
        correct: false,
        message: 'User answer validation failed: Invalid user answer format.',
      };
    }

    try {
      const alphabetStrategy = new StandardAlphabetStrategy();
      const memo = alphabetStrategy.normalise(question.answer);
      const submission = alphabetStrategy.normalise(userAnswer);

      if (memo === submission) {
        return {
          correct: false,
          message: 'The answer cannot be identical to the question',
        };
      }

      return new RegexConstructionStrategy().evaluate(question, userAnswer);
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
