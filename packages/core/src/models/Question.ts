import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionType: {
    type: String,
    required: true,
    enum: ['Regex Equivalence', 'Regex', 'Automaton to Regex', 'Construct Automaton', 'Construct Automaton Missing Symbols', 'Regex Accepts String'],
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
}, {
  timestamps: true,
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
