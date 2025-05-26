// store/restaurantSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { restaurants } from "../data/dummyData";

const initialState = {
  restaurants: restaurants, // Τα αρχικά dummy δεδομένα
};

const restaurantSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    updateRestaurantProfile: (state, action) => {
      const { restaurant_id, phone, email, socialMedia } = action.payload;
      const restaurant = state.restaurants.find((r) => r.id === restaurant_id);
      if (restaurant) {
        restaurant.contact.phone = phone || restaurant.contact.phone;
        restaurant.contact.email = email || restaurant.contact.email;
        restaurant.contact.socialMedia = {
          ...restaurant.contact.socialMedia,
          ...socialMedia,
        };
      }
    },
  },
});

export const { updateRestaurantProfile } = restaurantSlice.actions;
export default restaurantSlice.reducer;
