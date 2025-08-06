import {
  LogictutorAddScoreRequest,
  LogictutorLeaderboard,
  LogictutorUserScoreResponse,
} from '@edusoftware/core/src/types/logictutor';
import { apiSlice } from './api.slice';

export const leaderboardSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addScore: builder.mutation<
      string, // Response type
      LogictutorAddScoreRequest // Request payload type
    >({
      query: (body) => ({
        url: '/logictutor/leaderboard',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['LogictutorLevel'], // Invalidates all level-related queries
    }),
    getLogictutorLeaderboard: builder.query<
      LogictutorLeaderboard, // Response type
      string // Path param: levelId
    >({
      query: (levelId) => ({
        url: '/logictutor/leaderboard',
        method: 'GET',
        params: { levelId },
      }),
      providesTags: (_result, _error, levelId) => [
        { type: 'LogictutorLeaderboard', id: levelId },
      ],
    }),
    getUserScore: builder.query<
      LogictutorUserScoreResponse, // Response type
      string // Path param: levelId
    >({
      query: (levelId) => ({
        url: '/logictutor/score',
        method: 'GET',
        params: { levelId },
      }),
      providesTags: (_result, _error, levelId) => [
        { type: 'LogictutorLeaderboard', id: levelId },
      ],
    }),
  }),
});

export const {
  useAddScoreMutation,
  useGetLogictutorLeaderboardQuery,
  useGetUserScoreQuery,
} = leaderboardSlice;
