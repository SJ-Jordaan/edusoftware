import { AutomatonConverter } from '@edusoftware/core/conversions';
import { EvaluationStrategy } from './EvaluationStrategy.js';

export class RegexConstructionStrategy extends EvaluationStrategy {
  evaluate(question, userAnswer) {
    const userAnswerNFA = new AutomatonConverter(
      userAnswer,
      question.alphabet
    ).convert();

    if (!userAnswerNFA) {
      return { correct: false, message: 'Error in regex format.' };
    }

    const questionAnswerNFA = new AutomatonConverter(
      question.answer,
      question.alphabet
    ).convert();

    if (!questionAnswerNFA) {
      return {
        correct: false,
        message: 'Error in question answer format.',
      };
    }

    return this._evaluateCounterexamples(questionAnswerNFA, userAnswerNFA);
  }
}
