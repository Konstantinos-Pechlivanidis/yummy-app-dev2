import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

const initialState = {
  menu_items: [],
  restaurants: [], // You might populate this from the owner restaurant call
  status: 'idle',
  error: null,
};

export const addMenuItem = createAsyncThunk('menus/addMenuItem', async (itemData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/menuItems', itemData);
      return response.data.menu_item;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
});

export const editMenuItem = createAsyncThunk('menus/editMenuItem', async ({ id, ...updatedData }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.patch(`/menuItems/${id}`, updatedData);
        return response.data.menu_item;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const removeMenuItem = createAsyncThunk('menus/removeMenuItem', async ({ id, restaurant_id }, { rejectWithValue }) => {
    try {
        await axiosInstance.delete(`/menuItems/${id}`, { data: { restaurant_id } });
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data);
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