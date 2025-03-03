import { createSlice } from "@reduxjs/toolkit";
import { specialMenus, menuItems } from "../data/dummyData";

const initialState = {
  specialMenus: specialMenus, // Προεπιλεγμένα dummy data
};

const specialMenuSlice = createSlice({
  name: "specialMenus",
  initialState,
  reducers: {
    addSpecialMenu: (state, action) => {
      const { restaurantId, name, description, selectedItems, discountedPrice, timeRange } = action.payload;

      // Φιλτράρει τα διαθέσιμα πιάτα του εστιατορίου
      const availableItems = menuItems.filter(item => item.restaurantId === restaurantId);
      
      // Υπολογίζει την αρχική τιμή από τα επιλεγμένα πιάτα
      const originalPrice = selectedItems.reduce((total, item) => total + item.price, 0);
      const discountPercentage = ((originalPrice - discountedPrice) / originalPrice) * 100;

      const newMenu = {
        id: `menu${state.specialMenus.length + 1}`,
        restaurantId,
        name,
        description,
        originalPrice,
        discountedPrice,
        discountPercentage,
        photoUrl: "/images/default-menu.jpg",
        selectedItems,
        availableItems, // Διαθέσιμα πιάτα για επιλογή
        timeRange,
        createdAt: new Date().toISOString(),
      };

      state.specialMenus.push(newMenu);
    },

    removeSpecialMenu: (state, action) => {
      state.specialMenus = state.specialMenus.filter(menu => menu.id !== action.payload);
    },
  },
});

export const { addSpecialMenu, removeSpecialMenu } = specialMenuSlice.actions;
export default specialMenuSlice.reducer;
