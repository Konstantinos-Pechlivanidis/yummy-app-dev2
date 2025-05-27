import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    isLoading: false,
  },
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
    triggerLoading: (state, action) => {
      state.isLoading = true;
    },
  },
});

export const { showLoading, hideLoading, triggerLoading } = loadingSlice.actions;
export default loadingSlice.reducer;