import {
  LogictutorCreateLevelRequest,
  LogictutorFullLevel,
  LogictutorLevelObject,
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
    deleteLogictutorLevel: builder.mutation<
      string, // Response type
      string // Request payload type
    >({
      query: (levelId) => ({
        url: '/logictutor/level',
        method: 'DELETE',
        params: { levelId },
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
    getLogictutorLevel: builder.query<
      LogictutorFullLevel, // Response type
      string // Path param: test
    >({
      query: (levelId) => ({
        url: '/logictutor/level',
        method: 'GET',
        params: { levelId },
      }),
    }),
    getAllLevels: builder.query<LogictutorLevelObject[], undefined>({
      query: () => '/logictutor/level-previews',
    }),
  }),
});

export const {
  useCreateLogictutorLevelMutation,
  useUpdateTestEntryMutation,
  useDeleteLogictutorLevelMutation,
  useGetLogictutorLevelQuery,
  useGetAllLevelsQuery,
} = testApiSlice;
