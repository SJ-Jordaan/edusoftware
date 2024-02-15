import { AutomatonConverter } from 'common/conversions';
import { EvaluationStrategy } from './EvaluationStrategy.js';

export class AutomatonConstructionStrategy extends EvaluationStrategy {
  evaluate(question, userAnswer) {
    const userAnswerNFA = new AutomatonConverter(userAnswer).convert();
    return this._evaluateNFA(question, userAnswerNFA);
  }

  _evaluateNFA(question, userAnswerNFA) {
    if (!userAnswerNFA) {
      return { correct: false, message: 'Error in answer format.' };
    }

    const questionRegexConverter = new AutomatonConverter(
      question.answer,
      question.alphabet,
    );

    const questionAnswerNFA = questionRegexConverter.convert();

    if (!questionAnswerNFA) {
      return {
        correct: false,
        message: 'Error in question answer format.',
      };
    }

    return this._evaluateCounterexamples(questionAnswerNFA, userAnswerNFA);
  }
}
