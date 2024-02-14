import {
  AutomatonConverter,
  StandardAlphabetStrategy,
} from '@edusoftwre/core/conversions';

export abstract class EvaluationStrategy {
  evaluate() {
    console.error('Method \'evaluate()\' must be implemented.');
    return { correct: false, message: 'Evaluation strategy not implemented.' };
  }

  _normalizeAndParse(answer, alphabet) {
    return new AutomatonConverter(answer, alphabet).convert();
  }

  _union(l1, l2) {
    return l1
      .concat(l2)
      .filter(function (v, i, a) {
        return a.indexOf(v) === i;
      })
      .sort();
  }

  _findEquivalenceCounterexamples(m1, m2) {
    const alphabetStrategy = new StandardAlphabetStrategy();
    m1.alphabet = m2.alphabet = this._union(
      alphabetStrategy.normalise(m1.alphabet),
      alphabetStrategy.normalise(m2.alphabet)
    );

    m1 = m1.minimized();
    m2 = m2.minimized();

    return m1.find_equivalence_counterexamples(m2);
  }

  _evaluateCounterexamples(questionAnswerNFA, userAnswerNFA) {
    const [incorrectRejectCE, incorrectAcceptCE] =
      this._findEquivalenceCounterexamples(questionAnswerNFA, userAnswerNFA);

    if (incorrectRejectCE === null && incorrectAcceptCE === null) {
      return { correct: true };
    }

    const alphabetStrategy = new StandardAlphabetStrategy();

    if (incorrectRejectCE !== null) {
      return {
        correct: false,
        message: `Your solution incorrectly rejects ${alphabetStrategy.display(
          incorrectRejectCE
        )}.`,
      };
    }

    return {
      correct: false,
      message: `Your solution incorrectly accepts ${alphabetStrategy.display(
        incorrectAcceptCE
      )}.`,
    };
  }
}
