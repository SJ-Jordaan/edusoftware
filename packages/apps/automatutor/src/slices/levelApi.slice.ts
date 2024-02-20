import {
  IUpdateLevel,
  Level,
  PopulatedLevel,
  Question,
} from '@edusoftware/core/src/types';
import { apiSlice } from './api.slice';

const LEVEL_URL = '/level';
const QUESTION_URL = '/question';

interface UpdateLevelPayload {
  levelId: string;
  level: IUpdateLevel;
}

interface UpdateQuestionPayload extends Question {
  questionId: string;
}

export const levelApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchLevels: builder.query<PopulatedLevel[], void>({
      query: () => LEVEL_URL,
      providesTags: ['Level'],
    }),
    fetchLevel: builder.query<PopulatedLevel, string>({
      query: (levelId) => `${LEVEL_URL}/${levelId}`,
      providesTags: (_result, _error, levelId) => [
        { type: 'Level', id: levelId },
      ],
    }),
    createLevel: builder.mutation<Level, Level>({
      query: (level) => ({
        url: LEVEL_URL,
        method: 'POST',
        body: level,
      }),
      invalidatesTags: ['Level'],
    }),
    updateLevel: builder.mutation<Level, UpdateLevelPayload>({
      query: ({ levelId, level }) => ({
        url: `${LEVEL_URL}/${levelId}`,
        method: 'PUT',
        body: level,
      }),
      invalidatesTags: (_result, _error, { levelId }) => [
        { type: 'Level', id: levelId },
      ],
    }),
    deleteLevel: builder.mutation<string, string>({
      query: (levelId) => ({
        url: `${LEVEL_URL}/${levelId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Level'],
    }),
    createQuestion: builder.mutation<Question, Question>({
      query: (question) => ({
        url: QUESTION_URL,
        method: 'POST',
        body: question,
      }),
      invalidatesTags: ['Question', 'Level'],
    }),
    updateQuestion: builder.mutation<Question, UpdateQuestionPayload>({
      query: ({ questionId, ...question }) => ({
        url: `${QUESTION_URL}/${questionId}`,
        method: 'PUT',
        body: question,
      }),
      invalidatesTags: (_result, _error, { questionId }) => [
        { type: 'Question', id: questionId },
      ],
    }),
    deleteQuestion: builder.mutation<string, string>({
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
