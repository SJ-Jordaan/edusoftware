import {
  AutomatonConverter,
  StandardAlphabetStrategy,
} from 'common/conversions';

import { EvaluationStrategy } from './EvaluationStrategy.js';

export class RegexAcceptanceStrategy extends EvaluationStrategy {
  evaluate(question, userAnswer) {
    const regexNFA = new AutomatonConverter(
      question.answer,
      question.alphabet,
    ).convert();

    if (!regexNFA) {
      return { correct: false, message: 'Error in regex format.' };
    }

    const alphabetStrategy = new StandardAlphabetStrategy();

    const normalisedAnswer = alphabetStrategy.normalise(userAnswer);

    if (regexNFA.accepts(normalisedAnswer)) {
      return { correct: true };
    }

    return {
      correct: false,
      message: 'The string is not accepted by the regex',
    };
  }
}
