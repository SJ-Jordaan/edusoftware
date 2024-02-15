import {
  AutomatonConverter,
  StandardAlphabetStrategy,
} from '@edusoftwre/core/conversions';

// export abstract class EvaluationStrategy {
//   evaluate() {
//     console.error('Method \'evaluate()\' must be implemented.');
//     return { correct: false, message: 'Evaluation strategy not implemented.' };
//   }

//   _evaluateCounterexamples(questionAnswerNFA, userAnswerNFA) {
//     const [incorrectRejectCE, incorrectAcceptCE] =
//       this._findEquivalenceCounterexamples(questionAnswerNFA, userAnswerNFA);

//     if (incorrectRejectCE === null && incorrectAcceptCE === null) {
//       return { correct: true };
//     }

//     const alphabetStrategy = new StandardAlphabetStrategy();

//     if (incorrectRejectCE !== null) {
//       return {
//         correct: false,
//         message: `Your solution incorrectly rejects ${alphabetStrategy.display(
//           incorrectRejectCE,
//         )}.`,
//       };
//     }

//     return {
//       correct: false,
//       message: `Your solution incorrectly accepts ${alphabetStrategy.display(
//         incorrectAcceptCE,
//       )}.`,
//     };
//   }
// }

/**
 * Interface for evaluation strategies.
 */
export interface IEvaluationStrategy {
  /**
   * Evaluates the given answer against a set of criteria.
   * @returns An object indicating if the answer is correct and an optional message.
   */
  evaluate(): { correct: boolean; message?: string };
}
