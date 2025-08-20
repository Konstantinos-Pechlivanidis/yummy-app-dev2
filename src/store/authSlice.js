import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) { state.user = action.payload; },
    clearUser(state) { state.user = null; },
  },
});

export const { setUser, clearUser } = authSlice.actions;

// 🔹 Canonical selector used app‑wide
export const selectAuth = (state) => {
  const user = state.auth.user;
  return {
    user,
    isAuthenticated: !!user,
    role: user?.role ?? null,
  };
};

export default authSlice.reducer;