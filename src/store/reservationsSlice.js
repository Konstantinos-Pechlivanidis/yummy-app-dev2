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
      const { userId, restaurantId, date, time, guestCount, specialMenuId, couponId } = action.payload;

      state.reservations.push({
        id: `reservation${state.reservations.length + 1}`,
        userId,
        restaurantId,
        date,
        time,
        guestCount,
        specialMenuId,
        couponId,
        status: "pending", // Πάντα ξεκινάει ως "pending"
      });
    },

    approveReservation: (state, action) => {
      const reservation = state.reservations.find((r) => r.id === action.payload);
      if (reservation && reservation.status === "pending") {
        reservation.status = "approved"; // Από "pending" σε "approved"
      }
    },

    markAsCompleted: (state, action) => {
      const reservation = state.reservations.find((r) => r.id === action.payload);
      if (reservation && reservation.status === "approved") {
        reservation.status = "completed"; // Από "approved" σε "completed"
      }
    },

    cancelReservation: (state, action) => {
      const reservation = state.reservations.find((r) => r.id === action.payload);
      if (reservation && (reservation.status === "pending" || reservation.status === "approved")) {
        reservation.status = "canceled"; // Από "pending" ή "approved" σε "canceled"
      }
    },
  },
});

export const { addReservation, approveReservation, markAsCompleted, cancelReservation } = reservationsSlice.actions;
export default reservationsSlice.reducer;
