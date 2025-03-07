import { Badge } from '@edusoftware/core/src/types';
import { apiSlice } from './api.slice';

export const badgeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchBadges: builder.query<Badge[], void>({
      query: () => ({
        url: '/badges',
      }),
      transformResponse: (response: { badges: Badge[] }) => response.badges,
    }),
    checkBadgeProgress: builder.mutation<
      { newBadges: Badge[] },
      { metric: string; value: number }
    >({
      query: (body) => ({
        url: '/badges/check',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useFetchBadgesQuery, useCheckBadgeProgressMutation } = badgeApi;
