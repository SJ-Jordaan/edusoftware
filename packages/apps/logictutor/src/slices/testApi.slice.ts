import {
  LogictutorCreateLevelRequest,
  LogictutorFullLevel,
  LogictutorLevelObject,
  LogictutorUpdateLevelRequest,
} from '@edusoftware/core/src/types/logictutor';
import { apiSlice } from './api.slice';

export const testApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createLogictutorLevel: builder.mutation<
      string, // Response type
      LogictutorCreateLevelRequest // Request payload type
    >({
      query: (body) => ({
        url: '/logictutor/level',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['LogictutorLevel'], // Invalidates all level-related queries
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
    updateLogictutorLevel: builder.mutation<
      string, // Response type
      LogictutorUpdateLevelRequest // Request payload type
    >({
      query: (body) => ({
        url: '/logictutor/level',
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, body) => [
        { type: 'LogictutorLevel', id: body._id },
        'LogictutorLevel',
      ],
    }),
    getLogictutorLevel: builder.query<
      LogictutorFullLevel, // Response type
      string // Path param: levelId
    >({
      query: (levelId) => ({
        url: '/logictutor/level',
        method: 'GET',
        params: { levelId },
      }),
      providesTags: (result, error, levelId) => [
        { type: 'LogictutorLevel', id: levelId },
      ],
    }),
    getAllLevels: builder.query<LogictutorLevelObject[], undefined>({
      query: () => '/logictutor/level-previews',
      providesTags: ['LogictutorLevel'],
    }),
  }),
});

export const {
  useCreateLogictutorLevelMutation,
  useUpdateLogictutorLevelMutation,
  useDeleteLogictutorLevelMutation,
  useGetLogictutorLevelQuery,
  useGetAllLevelsQuery,
} = testApiSlice;
