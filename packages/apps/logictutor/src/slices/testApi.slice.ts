import {
  LogictutorLevel,
  TestDelete,
  TestUpdate,
} from '@edusoftware/core/src/types/logictutor';
import { apiSlice } from './api.slice';

export const testApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createLevel: builder.mutation<
      LogictutorLevel, // Response type
      LogictutorLevel // Request payload type
    >({
      query: (body) => ({
        url: '/logictutor/level',
        method: 'POST',
        body,
      }),
    }),
    deleteTestEntry: builder.mutation<
      TestDelete, // Response type
      TestDelete // Request payload type
    >({
      query: (body) => ({
        url: '/logictutor/test',
        method: 'DELETE',
        body,
      }),
    }),
    updateTestEntry: builder.mutation<
      TestUpdate, // Response type
      TestUpdate // Request payload type
    >({
      query: (body) => ({
        url: '/logictutor/test',
        method: 'PUT',
        body,
      }),
    }),
    getTestEntry: builder.query<
      { testString: string }, // Response type
      string // Path param: test
    >({
      query: (testParam) => `/logictutor/test/${testParam}`,
    }),
    getAllLevels: builder.query<LogictutorLevel[], undefined>({
      query: () => '/logictutor/level-previews',
    }),
  }),
});

export const {
  useCreateLevelMutation,
  useUpdateTestEntryMutation,
  useDeleteTestEntryMutation,
  useGetTestEntryQuery,
  useGetAllLevelsQuery,
} = testApiSlice;
