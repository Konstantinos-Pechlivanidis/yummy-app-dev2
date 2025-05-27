import { createSlice } from "@reduxjs/toolkit";
import { special_menus, menu_items } from "../data/dummyData";

const initialState = {
  special_menus: special_menus,
};

const specialMenuSlice = createSlice({
  name: "special_menus",
  initialState,
  reducers: {
    addSpecialMenu: (state, action) => {
      const { restaurant_id, name, description, selectedItems, discounted_price, timeRange } = action.payload;

      const availableItems = menu_items.filter(item => item.restaurant_id === restaurant_id);
      
      const original_price = selectedItems.reduce((total, item) => total + item.price, 0);
      const discount_percentage = ((original_price - discounted_price) / original_price) * 100;

      const newMenu = {
        id: `menu${state.special_menus.length + 1}`,
        restaurant_id,
        name,
        description,
        original_price,
        discounted_price,
        discount_percentage,
        photoUrl: "/images/default-menu.jpg",
        selectedItems,
        availableItems,
        timeRange,
        createdAt: new Date().toISOString(),
      };

      state.special_menus.push(newMenu);
    },

    removeSpecialMenu: (state, action) => {
      state.special_menus = state.special_menus.filter(menu => menu.id !== action.payload);
    },
  },
});

export const { addSpecialMenu, removeSpecialMenu } = specialMenuSlice.actions;
export default specialMenuSlice.reducer;
