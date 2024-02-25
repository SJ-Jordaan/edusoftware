import { IProgressDocumentPopulated } from '@edusoftware/core/src/databases';
import {
  AnswerEvaluation,
  GetLevelProgressResponse,
  PopulatedQuestion,
} from '@edusoftware/core/src/types';
import { apiSlice } from './api.slice';
import { handleRandomiseCoordinates } from '../pages/student/level-solver/common/algorithms';
const PROGRESS_URL = '/progress';

interface AnswerInputs {
  levelId: string;
  questionId: string;
  answer: string;
}

export const userProgressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startLevel: builder.mutation<void, string>({
      query: (levelId) => ({
        url: `${PROGRESS_URL}/${levelId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Progress', 'LevelProgress'],
    }),
    submitAnswer: builder.mutation<AnswerEvaluation, AnswerInputs>({
      query: ({ levelId, questionId, answer }) => ({
        url: `${PROGRESS_URL}/${levelId}/${questionId}`,
        method: 'POST',
        body: { answer },
      }),
      invalidatesTags: ['Progress', 'LevelProgress'],
    }), //TODO: Deprecate levelId
    getProgress: builder.query<IProgressDocumentPopulated[], string | void>({
      query: (levelId) => `${PROGRESS_URL}${levelId ? `/${levelId}` : ''}`,
      providesTags: ['Progress'],
    }),
    getLevelProgress: builder.query<
      { question?: PopulatedQuestion; isCompleted: boolean },
      string
    >({
      query: (levelId) => `${PROGRESS_URL}/level/${levelId}`,
      providesTags: ['LevelProgress'],
      transformResponse: (response: GetLevelProgressResponse) => {
        const { isCompleted, question } = response;

        if (!question) {
          throw new Error('No question provided');
        }

        const isAutomatonConstruction =
          question.questionType === 'Construct Automaton';

        const answer = isAutomatonConstruction
          ? handleRandomiseCoordinates(JSON.parse(question.answer))
          : '';

        console.log('answer', answer);

        return {
          isCompleted,
          question: {
            ...question,
            answer,
          },
        };
      },
    }),
  }),
});

export const {
  useStartLevelMutation,
  useSubmitAnswerMutation,
  useGetProgressQuery,
  useGetLevelProgressQuery,
} = userProgressApiSlice;
