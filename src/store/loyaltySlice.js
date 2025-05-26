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
      const { user_id, points } = action.payload;
      const user = state.users.find((u) => u.id === user_id);
      if (user) {
        user.loyalty_points += points;
      }
    },
    redeemPoints: (state, action) => {
      const { user_id, points } = action.payload;
      const user = state.users.find((u) => u.id === user_id);
      if (user && user.loyalty_points >= points) {
        user.loyalty_points -= points;
      }
    },
  },
});

export const { addPoints, redeemPoints } = loyaltySlice.actions;
export default loyaltySlice.reducer;
