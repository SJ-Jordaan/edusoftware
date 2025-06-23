import {
  TestCreate,
  TestDelete,
  TestUpdate,
} from '@edusoftware/core/src/types/logictutor';
import { apiSlice } from './api.slice';

export const testApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTestEntry: builder.mutation<
      TestCreate, // Response type
      TestCreate // Request payload type
    >({
      query: (body) => ({
        url: '/logictutor/test',
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
    getAllEntries: builder.query<{ testString: string }[], undefined>({
      query: () => '/logictutor/testAll',
    }),
  }),
});

export const {
  useCreateTestEntryMutation,
  useUpdateTestEntryMutation,
  useDeleteTestEntryMutation,
  useGetTestEntryQuery,
  useGetAllEntriesQuery,
} = testApiSlice;
