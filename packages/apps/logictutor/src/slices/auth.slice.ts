import { UserSession } from '@edusoftware/core/src/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../store';
import { isPrivilegedUser } from '@edusoftware/core/src/organisations';

interface AuthState {
  token: string | null;
  user: UserSession | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token')
    ? JSON.parse(localStorage.getItem('token') ?? '')
    : null,
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') ?? '')
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem('token', JSON.stringify(action.payload));
    },
    setUser: (state, action: PayloadAction<UserSession>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export function useAuth() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  return {
    token: auth.token,
    user: auth.user,
    isAuthenticated: !!auth.token,
    isAdmin: isPrivilegedUser(auth.user?.roles),
    setCredentials: (token: string) =>
      dispatch(authSlice.actions.setCredentials(token)),
    setUser: (user: UserSession) => dispatch(authSlice.actions.setUser(user)),
    logout: () => dispatch(authSlice.actions.logout()),
  };
}
export const { logout, setCredentials, setUser } = authSlice.actions;
export default authSlice.reducer;
