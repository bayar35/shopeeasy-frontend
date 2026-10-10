import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ⭐ Production Backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://shopeeasy-backend.onrender.com/api/v1";

export const fetchDashboardStats = createAsyncThunk(
  "analytics/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/admin/analytics`, {
        withCredentials: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch analytics" }
      );
    }
  }
);

const initialState = {
  stats: {
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
  },
  orderStatus: {
    processing: 0,
    shipped: 0,
    onTheWay: 0,
    delivered: 0,
    cancelled: 0,
  },
  salesLast7Days: [],
  salesLast30Days: [],
  topProducts: [],
  categorySales: [],
  recentOrders: [],
  recentUsers: [],
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.stats = action.payload.stats || initialState.stats;
        state.orderStatus =
          action.payload.orderStatus || initialState.orderStatus;
        state.salesLast7Days = action.payload.salesLast7Days || [];
        state.salesLast30Days = action.payload.salesLast30Days || [];
        state.topProducts = action.payload.topProducts || [];
        state.categorySales = action.payload.categorySales || [];
        state.recentOrders = action.payload.recentOrders || [];
        state.recentUsers = action.payload.recentUsers || [];
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch analytics";
      });
  },
});

export const { clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;