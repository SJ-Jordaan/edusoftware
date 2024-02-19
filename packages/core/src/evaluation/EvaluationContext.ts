import { AutomatonInput, AutomatonInputSchema } from '../types/AutomatonInput';
import { Question, QuestionSchema, QuestionType } from '../types/Question';
import {
  AutomatonConstructionStrategy,
  RegexConstructionStrategy,
  RegexEquivalenceStrategy,
  RegexAcceptanceStrategy,
  EvaluationStrategy,
} from './strategies';
/**
 * Context class for evaluating different types of questions related to automata and regular expressions.
 */
export class EvaluationContext {
  private strategy: EvaluationStrategy;

  /**
   * Initializes the evaluation context with the appropriate strategy based on the question type.
   * @param {QuestionType} questionType - The type of question to be evaluated.
   */
  constructor(questionType: QuestionType) {
    this.strategy = this._selectStrategy(questionType);
  }

  /**
   * Selects the appropriate strategy for the given question type.
   * @param {QuestionType} questionType - The type of question.
   * @returns {EvaluationStrategy} The strategy corresponding to the question type.
   * @throws {Error} If the question type is unsupported.
   */
  private _selectStrategy(questionType: QuestionType) {
    switch (questionType) {
      case 'Construct Automaton':
      case 'Construct Automaton Missing Symbols':
        return new AutomatonConstructionStrategy();
      case 'Regex':
        return new RegexConstructionStrategy();
      case 'Regex Equivalence':
        return new RegexEquivalenceStrategy();
      case 'Regex Accepts String':
        return new RegexAcceptanceStrategy();
      default:
        throw new Error(`Unsupported question type: ${questionType}`);
    }
  }

  /**
   * Evaluates the given question using the selected strategy.
   * @param {Question} question - The question to be evaluated.
   * @param {AutomatonInput} userAnswer - The user's answer to the question.
   * @returns {Object} The result of the evaluation, including whether the answer is correct and an optional message.
   */
  evaluateQuestion(
    question: Question,
    userAnswer: AutomatonInput,
  ): { correct: boolean; message?: string } {
    // Validate the question format
    const questionValidationResult = QuestionSchema.safeParse(question);
    if (!questionValidationResult.success) {
      throw new Error('Invalid question format.');
    }

    try {
      if (typeof userAnswer === 'string') {
        const parsed = JSON.parse(userAnswer);

        if (AutomatonInputSchema.parse(parsed)) {
          return this.strategy.evaluate(questionValidationResult.data, parsed);
        }
      }
    } catch (e: unknown) {
      if (AutomatonInputSchema.safeParse(userAnswer).success) {
        return this.strategy.evaluate(
          questionValidationResult.data,
          userAnswer,
        );
      }

      throw new Error(`Invalid user answer format: ${e}`);
    }

    throw new Error('Invalid user answer format.');
  }
}
