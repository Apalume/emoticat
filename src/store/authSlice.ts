import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string | null;
    token: string | null;
  };
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: {
    username: null,
    token: null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ username: string; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.user = { username: null, token: null };
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;