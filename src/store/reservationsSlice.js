import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

const initialState = {
  reservations: [],
  status: 'idle',
  error: null,
};

export const updateReservationStatus = createAsyncThunk(
  'reservations/updateStatus',
  async ({ reservationId, status, cancellation_reason = null }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch('/reservations/owner', {
        reservation_id: reservationId,
        status,
        cancellation_reason,
      });
      return response.data.reservation;
    } catch (error) {
      return rejectWithValue(error.response.data);
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