import { RootState } from './../store';
import {
  fetchBaseQuery,
  createApi,
  FetchArgs,
  BaseQueryApi,
} from '@reduxjs/toolkit/query/react';
import { logout } from './auth.slice';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state?.auth?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReAuth = async (
  args: FetchArgs | string,
  api: BaseQueryApi,
  extraOptions: object,
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }

  if (result.error && result.error.status === 403) {
    window.location.href = '/login/forbidden';
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['User', 'Level', 'Score', 'Progress', 'Question'],
  endpoints: () => ({}),
});
