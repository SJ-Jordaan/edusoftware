import { apiSlice } from './api.slice';

const LEVEL_URL = '/level';
const QUESTION_URL = '/question';

export const levelApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Existing endpoints
    fetchLevels: builder.query({
      query: () => `${LEVEL_URL}`,
      providesTags: ['Level'],
    }),
    fetchLevel: builder.query({
      query: (levelId) => `${LEVEL_URL}/${levelId}`,
      providesTags: (result, error, levelId) => [
        { type: 'Level', id: levelId },
      ],
    }),
    // New endpoints for levels
    createLevel: builder.mutation({
      query: (level) => ({
        url: LEVEL_URL,
        method: 'POST',
        body: level,
      }),
      invalidatesTags: ['Level'],
    }),
    updateLevel: builder.mutation({
      query: ({ levelId, level }) => ({
        url: `${LEVEL_URL}/${levelId}`,
        method: 'PUT',
        body: level,
      }),
      invalidatesTags: (result, error, { levelId }) => [
        { type: 'Level', id: levelId },
      ],
    }),
    deleteLevel: builder.mutation({
      query: (levelId) => ({
        url: `${LEVEL_URL}/${levelId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Level'],
    }),
    // Assuming similar endpoints for questions
    createQuestion: builder.mutation({
      query: (question) => ({
        url: QUESTION_URL,
        method: 'POST',
        body: question,
      }),
      invalidatesTags: ['Question', 'Level'],
    }),
    updateQuestion: builder.mutation({
      query: ({ questionId, ...question }) => ({
        url: `${QUESTION_URL}/${questionId}`,
        method: 'PUT',
        body: question,
      }),
      invalidatesTags: (result, error, { questionId }) => [
        { type: 'Question', id: questionId },
      ],
    }),
    deleteQuestion: builder.mutation({
      query: (questionId) => ({
        url: `${QUESTION_URL}/${questionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Question', 'Level'],
    }),
  }),
});

export const {
  useFetchLevelsQuery,
  useFetchLevelQuery,
  useCreateLevelMutation,
  useUpdateLevelMutation,
  useDeleteLevelMutation,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = levelApiSlice;
