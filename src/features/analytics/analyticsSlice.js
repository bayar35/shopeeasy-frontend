import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ===========================
// FETCH DASHBOARD STATS
// ===========================
export const fetchDashboardStats = createAsyncThunk(
  "analytics/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
  "https://shopeeasy-backend.onrender.com/api/v1/admin/analytics",
  { withCredentials: true }
);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch analytics" }
      );
    }
  }
);

// ===========================
// INITIAL STATE
// ===========================
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

// ===========================
// SLICE
// ===========================
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
      // analyticsSlice.js файлын доод хэсгийг ингэж засна:
.addCase(fetchDashboardStats.fulfilled, (state, action) => {
  state.loading = false;
  
  // ✅ Backend-ээс ирж буй датаны түлхүүр үгсийг шууд болон объект хэлбэрээр аль алинаар нь хамгаалж оноов
  state.stats = {
    totalRevenue: action.payload.totalRevenue || action.payload.stats?.totalRevenue || 0,
    totalOrders: action.payload.totalOrders || action.payload.stats?.totalOrders || 0,
    totalProducts: action.payload.totalProducts || action.payload.stats?.totalProducts || 0,
    totalUsers: action.payload.totalUsers || action.payload.stats?.totalUsers || 0,
  };

  state.orderStatus = action.payload.orderStatus || {
    processing: action.payload.processingOrders || 0,
    shipped: action.payload.shippedOrders || 0,
    delivered: action.payload.deliveredOrders || 0,
    cancelled: action.payload.cancelledOrders || 0,
  };

  state.salesLast7Days = action.payload.salesLast7Days || [];
  state.categorySales = action.payload.categorySales || [];
})

  },
});

export const { clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;