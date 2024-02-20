import { apiSlice } from './api.slice';
const PROGRESS_URL = '/progress';

export const userProgressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startLevel: builder.mutation({
      query: (levelId) => ({
        url: `${PROGRESS_URL}/${levelId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Progress'],
    }),
    submitAnswer: builder.mutation({
      query: ({ levelId, questionId, answerData }) => ({
        url: `${PROGRESS_URL}/${levelId}/${questionId}`,
        method: 'POST',
        body: answerData,
      }),
      invalidatesTags: ['Progress'],
    }),
    getProgress: builder.query({
      query: (levelId = '') => `${PROGRESS_URL}/${levelId}`,
      providesTags: ['Progress'],
    }),
  }),
});

export const {
  useStartLevelMutation,
  useSubmitAnswerMutation,
  useGetProgressQuery,
} = userProgressApiSlice;
