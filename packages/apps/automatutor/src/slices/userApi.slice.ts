import { UserSession } from '@edusoftware/core/src/types';
import { apiSlice } from './api.slice';

const SESSION_URL = '/session';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfo: builder.query<UserSession, string>({
      query: () => ({
        url: SESSION_URL,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetUserInfoQuery } = userApiSlice;
