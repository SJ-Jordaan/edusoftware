import { apiSlice } from './api.slice';

const SCORES_URL = '/scores';

export const scoreApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchLeaderboard: builder.query({
      query: () => ({
        url: `${SCORES_URL}`,
      }),
      providesTags: ['Score'],
    }),
  }),
});

export const { useFetchLeaderboardQuery } = scoreApiSlice;
