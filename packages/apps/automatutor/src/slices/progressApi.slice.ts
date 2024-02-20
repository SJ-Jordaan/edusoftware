import { AnswerEvaluation, UserProgress } from '@edusoftware/core/src/types';
import { apiSlice } from './api.slice';
const PROGRESS_URL = '/progress';

interface AnswerInputs {
  levelId: string;
  questionId: string;
  answerData: string;
}

export const userProgressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startLevel: builder.mutation<void, string>({
      query: (levelId) => ({
        url: `${PROGRESS_URL}/${levelId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Progress'],
    }),
    submitAnswer: builder.mutation<AnswerEvaluation, AnswerInputs>({
      query: ({ levelId, questionId, answerData }) => ({
        url: `${PROGRESS_URL}/${levelId}/${questionId}`,
        method: 'POST',
        body: answerData,
      }),
      invalidatesTags: ['Progress'],
    }),
    getProgress: builder.query<UserProgress | UserProgress[], string | void>({
      query: (levelId) => `${PROGRESS_URL}${levelId ? `/${levelId}` : ''}`,
      providesTags: ['Progress'],
    }),
  }),
});

export const {
  useStartLevelMutation,
  useSubmitAnswerMutation,
  useGetProgressQuery,
} = userProgressApiSlice;
