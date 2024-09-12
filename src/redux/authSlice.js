import { createSlice } from '@reduxjs/toolkit';
import { ROLES } from '../constants/role';

const initialState = {
  role: ROLES.USER,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setRole, (state, action) => {
      state.role = action.payload;
    });
  },
});

export const { setRole } = authSlice.actions;

export default authSlice.reducer;
