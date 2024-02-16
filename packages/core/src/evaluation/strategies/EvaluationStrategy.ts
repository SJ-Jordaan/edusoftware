import { AutomatonInput } from '../../types/AutomatonInput';
import { Question } from '../../types/Question';

/**
 * Interface for evaluation strategies.
 */
export interface EvaluationStrategy {
  /**
   * Evaluates the given answer against a set of criteria.
   * @returns An object indicating if the answer is correct and an optional message.
   */
  evaluate(
    question: Question,
    userAnswer: AutomatonInput,
  ): { correct: boolean; message?: string };
}
