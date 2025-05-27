import { createSlice } from "@reduxjs/toolkit";
import { reservations } from "../data/dummyData";

const initialState = {
  reservations: reservations,
};

const reservationsSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {
    addReservation: (state, action) => {
      const { user_id, restaurant_id, date, time, guest_count, special_menu_id, coupon_id } = action.payload;

      state.reservations.push({
        id: `reservation${state.reservations.length + 1}`,
        user_id,
        restaurant_id,
        date,
        time,
        guest_count,
        special_menu_id,
        coupon_id,
        status: "pending",
      });
    },

    approveReservation: (state, action) => {
      const reservation = state.reservations.find((r) => r.id === action.payload);
      if (reservation && reservation.status === "pending") {
        reservation.status = "approved";
      }
    },

    markAsCompleted: (state, action) => {
      const reservation = state.reservations.find((r) => r.id === action.payload);
      if (reservation && reservation.status === "approved") {
        reservation.status = "completed";
      }
    },

    cancelReservation: (state, action) => {
      const reservation = state.reservations.find((r) => r.id === action.payload);
      if (reservation && (reservation.status === "pending" || reservation.status === "approved")) {
        reservation.status = "canceled";
      }
    },
  },
});

export const { addReservation, approveReservation, markAsCompleted, cancelReservation } = reservationsSlice.actions;
export default reservationsSlice.reducer;
