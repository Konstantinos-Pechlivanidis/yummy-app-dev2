import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { menuItemApi } from "../config/api";

const initialState = {
  menu_items: [],
  restaurants: [], // You might populate this from the owner restaurant call
  status: 'idle',
  error: null,
};

export const addMenuItem = createAsyncThunk('menus/addMenuItem', async (itemData, { rejectWithValue }) => {
    try {
      const response = await menuItemApi.post('/', itemData);
      return response.data.menuItem || response.data.menu_item || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
});

export const editMenuItem = createAsyncThunk('menus/editMenuItem', async ({ id, ...updatedData }, { rejectWithValue }) => {
    try {
        const response = await menuItemApi.patch(`/${id}`, updatedData);
        return response.data.menuItem || response.data.menu_item || response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const removeMenuItem = createAsyncThunk('menus/removeMenuItem', async ({ id, restaurant_id }, { rejectWithValue }) => {
    try {
        await menuItemApi.delete(`/${id}`, { data: { restaurant_id } });
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const menusSlice = createSlice({
  name: "menus",
  initialState,
  reducers: {
    setMenuItems: (state, action) => {
        state.menu_items = action.payload;
    },
    setOwnerRestaurant: (state, action) => {
        state.restaurants = [action.payload];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.menu_items.push(action.payload);
      })
      .addCase(editMenuItem.fulfilled, (state, action) => {
        const index = state.menu_items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.menu_items[index] = action.payload;
        }
      })
      .addCase(removeMenuItem.fulfilled, (state, action) => {
        state.menu_items = state.menu_items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { setMenuItems, setOwnerRestaurant } = menusSlice.actions;
export default menusSlice.reducer;