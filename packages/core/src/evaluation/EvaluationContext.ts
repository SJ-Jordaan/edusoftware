import {
  AutomatonConstructionStrategy,
  RegexConstructionStrategy,
  RegexEquivalenceStrategy,
  RegexAcceptanceStrategy,
} from './strategies';

export type QuestionType =
  | 'Construct Automaton'
  | 'Construct Automaton Missing Symbols'
  | 'Regex'
  | 'Regex Equivalence'
  | 'Regex Accepts String';
/**
 * Context class for evaluating different types of questions related to automatons and regexes.
 */
export class EvaluationContext {
  /**
   * The strategy to use for evaluating the question.
   * @type {AutomatonConstructionStrategy | RegexConstructionStrategy | RegexEquivalenceStrategy | RegexAcceptanceStrategy}
   */
  private strategy;

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
   * @returns The strategy corresponding to the question type.
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
   * @param question - The question to be evaluated.
   * @param userAnswer - The user's answer to the question.
   * @returns The result of the evaluation.
   */
  evaluateQuestion(question: any, userAnswer: any) {
    // Consider defining types for question and userAnswer if possible.
    // Validate inputs here if necessary, possibly with zod if question and userAnswer have complex structures.
    return this.strategy.evaluate(question, userAnswer);
  }
}
