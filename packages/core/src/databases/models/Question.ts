import mongoose from 'mongoose';

enum QuestionType {
  RegexEquivalence = 'Regex Equivalence',
  Regex = 'Regex',
  AutomatonToRegex = 'Automaton to Regex',
  ConstructAutomaton = 'Construct Automaton',
  ConstructAutomatonMissingSymbols = 'Construct Automaton Missing Symbols',
  RegexAcceptsString = 'Regex Accepts String',
}

export interface IQuestionDoc extends mongoose.Document {
  questionType: QuestionType;
  questionContent: string;
  answer: string;
  hints: string[];
  score: number;
  alphabet: string;
  operators: string[];
}

const questionSchema = new mongoose.Schema(
  {
    questionType: {
      type: String,
      required: true,
      enum: Object.values(QuestionType),
    },
    questionContent: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    hints: [String],
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    alphabet: {
      type: String,
      required: true,
    },
    operators: [String],
  },
  {
    timestamps: true,
  },
);

export const Question = mongoose.model<IQuestionDoc>(
  'Question',
  questionSchema,
);
