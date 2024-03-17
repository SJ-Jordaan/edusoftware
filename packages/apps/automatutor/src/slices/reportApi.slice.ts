import { DashboardReport } from '@edusoftware/core/src/types';
import { apiSlice } from './api.slice';
const REPORTS_URL = '/report';

export const scoreApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchDashboard: builder.query<DashboardReport, void>({
      query: () => `${REPORTS_URL}/dashboard`,
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useFetchDashboardQuery } = scoreApiSlice;
