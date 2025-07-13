// import { useState } from 'react';
import { LogictutorCreateLevelRequest } from '@edusoftware/core/src/types';
import { useCreateLogictutorLevelMutation } from '../../slices/testApi.slice';
import { useState } from 'react';
interface TestCardProps {
  refetch: () => void; // or Promise<void> if it's async
}

export const TestCard = ({ refetch }: TestCardProps) => {
  const [levelName, setLevelName] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<
    Array<{
      booleanExpression: string;
      questionContent: string;
      hints: string;
    }>
  >([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { booleanExpression: '', questionContent: '', hints: '' },
    ]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, index) => idx !== index));
  };

  const updateQuestionField = (
    index: number,
    field: 'booleanExpression' | 'questionContent' | 'hints',
    value: string,
  ) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const submitLevel = async () => {
    const level: LogictutorCreateLevelRequest = {
      levelName: levelName,
      description: description,
      difficulty: 'BEGINNER',
      questions: questions.map((question) => {
        return {
          ...question,
          hints: question.hints.split(','),
          score: 5,
          answer: '',
        };
      }),
    };
    await createLevel(level);

    refetch();
    setLevelName('');
    setDescription('');
    setQuestions([]);
  };

  const [createLevel, { isLoading: isCreating, error: createError }] =
    useCreateLogictutorLevelMutation();

  return (
    <div className="flex flex-col gap-4 text-white">
      {createError && <div>{createError.toString()}</div>}
      {isCreating && <div>Creating...</div>}
      <div className="flex gap-4">
        <p>Level Name</p>
        <input
          className="text-black"
          type="text"
          placeholder="Level Name"
          value={levelName}
          onChange={(e) => setLevelName(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <p>Description</p>
        <input
          className="text-black"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button onClick={addQuestion}>Add Question</button>

      <p>AND: (·,.,&)</p>
      <p>OR: (+,|)</p>
      <p>NOT: (¬,!)</p>
      <p>XOR: (⊕,^)</p>
      {questions.map((question, idx) => (
        <div className="flex  gap-4 text-white" key={idx}>
          <div className="flex gap-4">
            <p>Boolean Expression</p>
            <input
              className="text-black"
              type="text"
              placeholder="Boolean Expression"
              value={question.booleanExpression}
              onChange={(e) =>
                updateQuestionField(idx, 'booleanExpression', e.target.value)
              }
            />
          </div>
          <div className="flex gap-4">
            <p>Question Content</p>
            <input
              className="text-black"
              type="text"
              placeholder="Question Content"
              value={question.questionContent}
              onChange={(e) =>
                updateQuestionField(idx, 'questionContent', e.target.value)
              }
            />
          </div>
          <div className="flex gap-4">
            <p>Hints (comma separated)</p>
            <input
              className="text-black"
              type="text"
              placeholder="Hints"
              value={question.hints}
              onChange={(e) =>
                updateQuestionField(idx, 'hints', e.target.value)
              }
            />
          </div>
          <button onClick={() => removeQuestion(idx)}>Remove Question</button>
        </div>
      ))}

      <button onClick={submitLevel}>Submit Level</button>
    </div>
  );
};
