import { createSlice } from "@reduxjs/toolkit";
import { users } from "../data/dummyData"; // Χρησιμοποιούμε τα dummy δεδομένα

const initialState = {
  user: null, // Ο χρήστης που έχει κάνει login
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload;
      const foundUser = users.find((user) => user.email === email && user.password === password);
      if (foundUser) {
        state.user = foundUser;
        state.isAuthenticated = true;
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateProfile: (state, action) => {
      if (state.user) {
        const { name, email, phone, profileImage } = action.payload;
        state.user.name = name || state.user.name;
        state.user.email = email || state.user.email;
        state.user.phone = phone || state.user.phone;
        state.user.profileImage = profileImage || state.user.profileImage; // Updating image
      }
    },
    addToWatchlist: (state, action) => {
      if (state.user) {
        const restaurantId = action.payload;
        if (!state.user.favoriteRestaurants.includes(restaurantId)) {
          state.user.favoriteRestaurants.push(restaurantId);
        }
      }
    },
    removeFromWatchlist: (state, action) => {
      if (state.user) {
        state.user.favoriteRestaurants = state.user.favoriteRestaurants.filter(
          (id) => id !== action.payload
        );
      }
    },
  },
});

export const { login, logout, updateProfile,addToWatchlist,removeFromWatchlist } = authSlice.actions;
export default authSlice.reducer;
