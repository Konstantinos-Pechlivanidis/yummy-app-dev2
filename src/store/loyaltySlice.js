import { createSlice } from "@reduxjs/toolkit";
import { users } from "../data/dummyData";

const initialState = {
  users: users,
};

const loyaltySlice = createSlice({
  name: "loyalty",
  initialState,
  reducers: {
    addPoints: (state, action) => {
      const { userId, points } = action.payload;
      const user = state.users.find((u) => u.id === userId);
      if (user) {
        user.loyaltyPoints += points;
      }
    },
    redeemPoints: (state, action) => {
      const { userId, points } = action.payload;
      const user = state.users.find((u) => u.id === userId);
      if (user && user.loyaltyPoints >= points) {
        user.loyaltyPoints -= points;
      }
    },
  },
});

export const { addPoints, redeemPoints } = loyaltySlice.actions;
export default loyaltySlice.reducer;
