import { apiSlice } from './api.slice';
const SCORES_URL = '/score';

export const scoreApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchLeaderboard: builder.query({
      query: (levelId = '') => `${SCORES_URL}/${levelId}`, // Adjust if your API expects different URL structure
      providesTags: ['Score'],
    }),
  }),
});

export const { useFetchLeaderboardQuery } = scoreApiSlice;
