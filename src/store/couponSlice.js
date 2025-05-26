import { createSlice } from "@reduxjs/toolkit";
import { coupons } from "../data/dummyData";

const initialState = {
  coupons: coupons || [], // Αν δεν υπάρχουν, αρχικοποιούμε με κενό array
};

const couponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    addCoupon: (state, action) => {
      const { restaurant_id, description, discount_percentage } = action.payload;

      const newCoupon = {
        id: `coupon${state.coupons.length + 1}`, // Δημιουργία μοναδικού ID
        restaurant_id,
        description,
        discount_percentage,
      };

      state.coupons.push(newCoupon);
    },

    removeCoupon: (state, action) => {
      state.coupons = state.coupons.filter(coupon => coupon.id !== action.payload);
    },
  },
});

export const { addCoupon, removeCoupon } = couponSlice.actions;
export default couponSlice.reducer;
