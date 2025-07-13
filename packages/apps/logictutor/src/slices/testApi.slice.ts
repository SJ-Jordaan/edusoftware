import {
  LogictutorCreateLevelRequest,
  LogictutorLevel,
  TestDelete,
  TestUpdate,
} from '@edusoftware/core/src/types/logictutor';
import { apiSlice } from './api.slice';

export const testApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createLogictutorLevel: builder.mutation<
      LogictutorCreateLevelRequest, // Response type
      LogictutorCreateLevelRequest // Request payload type
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
  useCreateLogictutorLevelMutation,
  useUpdateTestEntryMutation,
  useDeleteTestEntryMutation,
  useGetTestEntryQuery,
  useGetAllLevelsQuery,
} = testApiSlice;
