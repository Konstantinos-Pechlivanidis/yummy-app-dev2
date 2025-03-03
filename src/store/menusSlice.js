import { createSlice } from "@reduxjs/toolkit";
import { menuItems, restaurants } from "../data/dummyData";

const initialState = {
  menuItems: menuItems,
  restaurants: restaurants,
};

const menusSlice = createSlice({
  name: "menus",
  initialState,
  reducers: {
    addMenuItem: (state, action) => {
      state.menuItems.push(action.payload);
    },
    removeMenuItem: (state, action) => {
      state.menuItems = state.menuItems.filter((item) => item.id !== action.payload);
    },
    editMenuItem: (state, action) => {
      const { id, updatedData } = action.payload;
      const itemIndex = state.menuItems.findIndex((item) => item.id === id);
      if (itemIndex !== -1) {
        state.menuItems[itemIndex] = { ...state.menuItems[itemIndex], ...updatedData };
      }
    },
    uploadMenuItemImage: (state, action) => {
      const { id, imageUrl } = action.payload;
      const item = state.menuItems.find((item) => item.id === id);
      if (item) {
        item.photoUrl = imageUrl;
      }
    },
  },
});

export const { addMenuItem, removeMenuItem, editMenuItem, uploadMenuItemImage } = menusSlice.actions;
export default menusSlice.reducer;
