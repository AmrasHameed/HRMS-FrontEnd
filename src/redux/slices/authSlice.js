import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('hrms_token');
const user = token ? JSON.parse(atob(token.split('.')[1])) : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user || null,
    token: token || null,
  },
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('hrms_token', action.payload.token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('hrms_token');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
