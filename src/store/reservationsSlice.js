import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reservationApi } from "../config/api";

const initialState = {
  reservations: [],
  status: 'idle',
  error: null,
};

export const updateReservationStatus = createAsyncThunk(
  'reservations/updateStatus',
  async ({ reservationId, status, cancellation_reason = null }, { rejectWithValue }) => {
    try {
      const response = await reservationApi.patch('/owner/status', {
        reservation_id: reservationId,
        status,
        cancellation_reason,
      });
      return response.data.reservation || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const reservationsSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {
    setReservations: (state, action) => {
        state.reservations = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateReservationStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateReservationStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.reservations.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
      })
      .addCase(updateReservationStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setReservations } = reservationsSlice.actions;
export default reservationsSlice.reducer;