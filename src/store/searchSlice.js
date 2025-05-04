import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  date: "",
  time: "",
  guests: 1,
  location: "",
  cuisine: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchParams: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearSearchParams: () => initialState,
  },
});

export const { setSearchParams, clearSearchParams } = searchSlice.actions;
export default searchSlice.reducer;