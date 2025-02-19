import {
  LeaderboardEntry,
  LeaderboardFilters,
} from '@edusoftware/core/src/types';
import { apiSlice } from './api.slice';

const SCORES_URL = '/scores';

export const scoreApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchLeaderboard: builder.query<LeaderboardEntry[], LeaderboardFilters>({
      query: (filters) => ({
        url: `${SCORES_URL}`,
        params: {
          ...filters,
        },
      }),
      providesTags: ['Score'],
    }),
  }),
});

export const { useFetchLeaderboardQuery } = scoreApiSlice;
