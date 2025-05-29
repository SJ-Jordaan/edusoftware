import {
  GetLevelsQueryParams,
  IUpdateLevel,
  Level,
  LevelObject,
  PopulatedLevelObject,
  Question,
  QuestionObject,
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

export const levelApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchLevels: builder.query<
      PopulatedLevelObject[],
      GetLevelsQueryParams | void
    >({
      query: (params) => {
        if (!params) return LEVEL_URL;

        const queryParams = new URLSearchParams();
        if (params.isPractice !== undefined) {
          queryParams.append('isPractice', params.isPractice.toString());
        }
        if (params.track) {
          queryParams.append('track', params.track);
        }

        return `${LEVEL_URL}?${queryParams.toString()}`;
      },
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
