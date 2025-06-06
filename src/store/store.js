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

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reservations: reservationsReducer,
    menus: menusReducer,
    loyalty: loyaltyReducer,
    payment: paymentSlice,
    specialMenus: specialMenuReducer,
    coupons: couponReducer,
    restaurants: restaurantReducer,
    search: searchReducer,
  },
});

export default store;
