import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import { apiSlice } from './slices/api.slice';
import { useDispatch, useSelector } from 'react-redux';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: <TSelected>(
  selector: (state: RootState) => TSelected,
) => TSelected = (selector) => useSelector(selector);
export default store;
