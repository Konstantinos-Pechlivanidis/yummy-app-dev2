import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import reservationsReducer from "./reservationsSlice";
import menusReducer from "./menusSlice";
import loyaltyReducer from "./loyaltySlice";
import paymentSlice from "./paymentSlice";
import specialMenuReducer from "./specialMenuSlice";
import couponReducer from "./couponSlice";
import restaurantReducer from "./restaurantSlice";
import searchReducer from "./searchSlice";
import loadingReducer from "./loadingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reservations: reservationsReducer,
    menus: menusReducer,
    loyalty: loyaltyReducer,
    payment: paymentSlice,
    special_menus: specialMenuReducer,
    coupons: couponReducer,
    restaurants: restaurantReducer,
    search: searchReducer,
    loading: loadingReducer,
  },
});

export default store;
