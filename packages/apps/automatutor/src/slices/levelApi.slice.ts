import {
  IUpdateLevel,
  Level,
  PopulatedLevel,
  Question,
} from '@edusoftware/core/src/types';
import { apiSlice } from './api.slice';

const LEVEL_URL = '/levels';
const QUESTION_URL = '/questions';

interface UpdateLevelPayload {
  levelId: string;
  level: IUpdateLevel;
}

interface UpdateQuestionPayload extends Question {
  questionId: string;
}

type PopulatedLevelObject = PopulatedLevel & { _id: string };
type LevelObject = Level & { _id: string };
type QuestionObject = Question & { _id: string };

export const levelApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchLevels: builder.query<PopulatedLevelObject[], void>({
      query: () => LEVEL_URL,
      providesTags: ['Level'],
    }),
    fetchLevel: builder.query<PopulatedLevelObject, string>({
      query: (levelId) => `${LEVEL_URL}/${levelId}`,
      providesTags: (_result, _error, levelId) => [
        { type: 'Level', id: levelId },
      ],
    }),
    createLevel: builder.mutation<LevelObject, Level>({
      query: (level) => ({
        url: LEVEL_URL,
        method: 'POST',
        body: level,
      }),
      invalidatesTags: ['Level'],
    }),
    updateLevel: builder.mutation<LevelObject, UpdateLevelPayload>({
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
    createQuestion: builder.mutation<QuestionObject, Question>({
      query: (question) => ({
        url: QUESTION_URL,
        method: 'POST',
        body: question,
      }),
      invalidatesTags: ['Question', 'Level'],
    }),
    updateQuestion: builder.mutation<QuestionObject, UpdateQuestionPayload>({
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
