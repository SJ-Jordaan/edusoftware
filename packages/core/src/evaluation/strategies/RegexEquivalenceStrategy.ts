import { StandardAlphabetStrategy } from 'common/conversions';
import { EvaluationStrategy } from './EvaluationStrategy.js';
import { RegexConstructionStrategy } from './RegexConstructionStrategy.js';

export class RegexEquivalenceStrategy extends EvaluationStrategy {
  evaluate(question, userAnswer) {
    const alphabetStrategy = new StandardAlphabetStrategy();
    const memo = alphabetStrategy.normalise(question.answer);
    const submission = alphabetStrategy.normalise(userAnswer);

    if (this._isIdentical(memo, submission)) {
      return {
        correct: false,
        message: 'The answer cannot be identical to the question',
      };
    }

    const constructionStrategy = new RegexConstructionStrategy();
    return constructionStrategy.evaluate(question, submission);
  }

  _isIdentical(regex1, regex2) {
    return regex1 === regex2;
  }
}
