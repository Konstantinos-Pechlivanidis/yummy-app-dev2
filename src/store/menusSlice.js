import { createSlice } from "@reduxjs/toolkit";
import { menu_items, restaurants } from "../data/dummyData";

const initialState = {
  menu_items: menu_items,
  restaurants: restaurants,
};

const menusSlice = createSlice({
  name: "menus",
  initialState,
  reducers: {
    addMenuItem: (state, action) => {
      state.menu_items.push(action.payload);
    },
    removeMenuItem: (state, action) => {
      state.menu_items = state.menu_items.filter((item) => item.id !== action.payload);
    },
    editMenuItem: (state, action) => {
      const { id, updatedData } = action.payload;
      const itemIndex = state.menu_items.findIndex((item) => item.id === id);
      if (itemIndex !== -1) {
        state.menu_items[itemIndex] = { ...state.menu_items[itemIndex], ...updatedData };
      }
    },
    uploadMenuItemImage: (state, action) => {
      const { id, imageUrl } = action.payload;
      const item = state.menu_items.find((item) => item.id === id);
      if (item) {
        item.photoUrl = imageUrl;
      }
    },
  },
});

export const { addMenuItem, removeMenuItem, editMenuItem, uploadMenuItemImage } = menusSlice.actions;
export default menusSlice.reducer;
