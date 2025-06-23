import mongoose from 'mongoose';

const testEntrySchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
});

export const TestEntry =
  mongoose.models.TestEntry || mongoose.model('TestEntry', testEntrySchema);
