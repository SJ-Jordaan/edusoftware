import {
  AutomatonConstructionStrategy,
  RegexConstructionStrategy,
  RegexEquivalenceStrategy,
  RegexAcceptanceStrategy,
} from './strategies';

export class EvaluationContext {
  constructor(questionType) {
    this.strategy = this._selectStrategy(questionType);
  }

  _selectStrategy(questionType) {
    if (
      questionType === 'Construct Automaton' ||
      questionType === 'Construct Automaton Missing Symbols'
    ) {
      return new AutomatonConstructionStrategy();
    }

    if (questionType === 'Regex') {
      return new RegexConstructionStrategy();
    }

    if (questionType === 'Regex Equivalence') {
      return new RegexEquivalenceStrategy();
    }

    if (questionType === 'Regex Accepts String') {
      return new RegexAcceptanceStrategy();
    }

    throw new Error(`Unsupported question type: ${questionType}`);
  }

  evaluateQuestion(question, userAnswer) {
    return this.strategy.evaluate(question, userAnswer);
  }
}
