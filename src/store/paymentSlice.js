import { createSlice } from "@reduxjs/toolkit";
import { payments } from "../data/dummyData";

const initialState = {
  payments: payments,
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    addPayment: (state, action) => {
      const { userId, reservationId, amount, paymentMethod } = action.payload;
      state.payments.push({
        id: `payment${state.payments.length + 1}`,
        userId,
        reservationId,
        amount,
        paymentMethod,
        status: "pending",
        transactionId: `TXN${Date.now()}`,
      });
    },
    completePayment: (state, action) => {
      const payment = state.payments.find((p) => p.id === action.payload);
      if (payment) {
        payment.status = "completed";
      }
    },
    failPayment: (state, action) => {
      const payment = state.payments.find((p) => p.id === action.payload);
      if (payment) {
        payment.status = "failed";
      }
    },
  },
});

export const { addPayment, completePayment, failPayment } = paymentsSlice.actions;
export default paymentsSlice.reducer;
